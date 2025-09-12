import {useState, useEffect, useMemo, useRef} from 'react';
import {
  Input,
  List,
  Card,
  Button,
  message,
  Typography,
  Row,
  Col,
  AutoComplete,
  Spin,
  Tooltip,
  Modal,
  Tabs,
  Checkbox
} from 'antd';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  UserOutlined,
  WarningTwoTone, RedoOutlined, EnvironmentOutlined, InboxOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import {GET_MEDICINE_CATEGORIES_PAGINATION} from "@/api/medicineCategory.api.ts";
import useApi from "@/hooks/useApi.tsx";
import {generateBill} from "@/utils/function.ts";
import "./Cart.css"
import BaseForm from "@/components/BaseForm.tsx";
import {fields as customerFields} from "@/pages/customer/Customer.data";
import {CartItem, InventoryMed} from "@/types/CartTypes.ts";
import {useAtom} from "jotai/index";
import {stateCart} from "@/states/cart.ts";
import {CustomerInterface} from '@/pages/customer/Customer.type.ts';
import dayjs from 'dayjs';
import {atomApp} from "@/states/app.ts";
import debounce from "lodash/debounce";

const { Title } = Typography;
const { Search } = Input;

interface Category {
  "id": string,
  "name": string,
  "description"?: string
  "createdDate"?: string
  "createdBy"?: string
  "updatedDate"?: string
  "updatedBy"?: string
}

interface Customer {
  id: string,
  firstName: string,
  lastName: string,
  age: number,
  sex: string,
  phoneNo: string,
  mail: string,
  value:string,
  label: string
}

export default function PharmacyPOS() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useAtom(stateCart)
  const [appState, setAppState] = useAtom(atomApp)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, _setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<InventoryMed[]>([]);
  const [loadingMed, setLoadingMed] = useState<boolean>(false);
  const [_categories, setCategories] = useState<Category[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18
  const [total, setTotal] = useState(0);
  const { get, post} = useApi()
  const getCategories = async () => {
    const params: any = {
      page: 0,
      size: 200,
    }
    const resp = await get(GET_MEDICINE_CATEGORIES_PAGINATION, params)
    setCategories([{id: 'all', name: 'All'}, ...resp.content])
  }

  const handleFinishCustomer = async (values: CustomerInterface) => {
    setLoading(true)
    try {
      const customer = (await post('/customers', {
        ...values,
      }));
      setSelectedCustomer({
        ...customer,
        value: `${customer.phoneNo} (${customer.firstName} ${customer.lastName || ''})`,
        label: `${customer.phoneNo} (${customer.firstName} ${customer.lastName || ''})`,
      })
      message.success('Customer created successfully');
      setIsModalVisible(false);
    } catch (error) {
      console.log(error)
      message.error('Failed to save customer');
    }
    setLoading(false)
  };

  const fetchRef = useRef(0);
  const getMeds = useMemo(() => {
    const loadMeds = (v: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setLoadingMed(true)
      const params: any = {
        page: currentPage - 1,
        size: pageSize,
        medicineName: v || undefined,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory
      }
      get('/orders/cart', params).then(({ content, totalElement }) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setFilteredProducts(content);
        setTotal(totalElement)
        setLoadingMed(false)
      })
    };

    return debounce(loadMeds, 300);
  }, []);

  useEffect(() => {
    getCategories()
  }, [])
  useEffect(() => {
    getMeds(searchTerm)
  }, [searchTerm, selectedCategory, currentPage]);

  const addToCart = (product: InventoryMed) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item.id === id) {
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => total + item.medicine.price * item.quantity, 0)
    if(appState.usePoint) {
      return total - appState.customerSelected?.points || 0
    }
    return total
  };

  const printOrder = (order: any) => {
    const listItems = cart.map(c => ({
      quantity: c.quantity,
      name: c.medicine.name,
      price: c.medicine.price,
      amount: c.medicine.price * c.quantity
    }))
    const printContent = generateBill({
      listItems,
      orderCode: order?.code,
      amount: order.totalAmount,
      orderPayTime: dayjs(new Date(order?.createdDate)).format('DD-MM-YYYY HH:mm'),
      totalAmount: listItems.reduce((a, v) => v.amount + a, 0),
    })
    const windowPrint = window.open('');
    windowPrint?.document.write(printContent);
    windowPrint?.document.close();
    setTimeout(() => {
      windowPrint?.focus();
      windowPrint?.print();
      windowPrint?.close();
    }, 1000)
  }

  const handleRefund = async () => {
    setLoading(true)
    const orderRefund = (await post('/orders/refund', cart.map(c => ({
      refundItemId: c.id,
      refundItemQuantity: c.quantity,
    }))))
    if(orderRefund) {
      setSearchTerm('')
      Modal.success({
        title: 'Refund successfully !',
        footer: (_, { OkBtn }) => (
            <>
              <OkBtn />
            </>
        )

      })
      setCart([]);
      setSelectedCustomer(null);
      setUsePoint(false)
    }
    setLoading(false)
  }

  const setUsePoint = (t: boolean) => {
    setAppState({...appState, usePoint: t})
  }

  const setTypeOrder = (t: string) => {
    setAppState({...appState, typeOrder: t})
  }

  const setSelectedCustomer = (c: Customer | null) => {
    setUsePoint(c ? appState.usePoint : false)
    setAppState({...appState, customerSelected: c})
  }

  const handleCheckout = async () => {
    if(appState.typeOrder == 'refund') {
      return handleRefund()
    }
    const dataBody = {
      customerId: appState.customerSelected?.id,
      address: customerAddress,
      usePoint: false,
      orderItems: cart.map(c => ({
        cartId: c.id,
        quantity: c.quantity,
        price: c.medicine.price
      }))
    }
    setLoading(true)
    const order = (await post('/orders', dataBody))
    if(order) {
      setSearchTerm('')
      Modal.success({
        title: appState.customerSelected ? `Order placed successfully for ${appState.customerSelected?.label}!` : 'Order placed successfully!',
        footer: (_, { OkBtn }) => (
            <>
              <Button onClick={() => printOrder(order)}>Print bill</Button>
              <OkBtn />
            </>
        )

      })
      setCart([]);
      setSelectedCustomer(null);
    }
    setLoading(false)
  };

  const handleCustomerSearch = async (value: string) => {
    setSearchCustomer(value)
    const params: any = {
      page: 0,
      size: 100,
      phoneNo: value
    }
    const {content} = await get('/customers', params)
    setCustomerOptions(
      content.map((customer: any) => ({
        ...customer,
        value: `${customer.phoneNo} (${customer.firstName || ''} ${customer.lastName || ''})`,
        label: `${customer.phoneNo} (${customer.firstName || ''} ${customer.lastName || ''})`,
      }))
    );
  };

  const handleCustomerSelect = (value: string) => {
    const selectedCustomer = customerOptions.find(customer => customer.value === value);
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer);
      message.success(`Customer ${selectedCustomer.label} added to the order.`);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen">
        <div className="flex items-center justify-between p-0">
          <Search
            placeholder="Search medicines"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: 300, marginRight: 16}} size="large"
          />
        </div>
        <div style={{padding: '24px'}}>
          <Row gutter={24}>
            <Col span={16}>
              <List
                pagination={{
                  onChange: (page) => {
                    setCurrentPage(page)
                  },
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: false,
                  align: "center"
                }}
                grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3}}
                dataSource={filteredProducts}
                loading={loadingMed}
                renderItem={(product) => (
                  <List.Item className="pos-list-med">
                    <Card
                        hoverable={true} className={product.isGettingExpire ? 'border-warning' : ''}
                        title={product.medicine.name}
                        extra={product.isGettingExpire ? <Tooltip title='Warning: Medication is about to expire'>
                          <WarningTwoTone style={{fontSize: '1.5rem'}} twoToneColor="#EB772FFF"/>
                        </Tooltip> : <></>}
                        actions={[
                          <Button color="primary" variant="text" className="add-to-cart"
                                  onClick={() => addToCart(product)}>
                            <strong>Add to Cart</strong>
                          </Button>
                        ]}
                    >
                      <p className={'text-red-500'}>$ {product.medicine.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                      <p style={{color: '#a5a5a5', display: 'flex', justifyContent: 'space-between'}}>
                        <Tooltip
                            title={'Location: ' + (product?.locationRack?.position || '-')}><span><EnvironmentOutlined/> {product?.locationRack?.position || '-'}</span></Tooltip>
                        <Tooltip
                            title={'In-stock: ' + (product.medicine?.unit?.unit || 'pcs')}><span><InboxOutlined/> {product.quantity} {product.medicine?.unit?.unit || 'pcs'}</span></Tooltip>

                      </p>
                      <p style={{color: '#a5a5a5', display: 'flex', justifyContent: 'space-between'}}>
                        <Tooltip
                            title={'Expired date: ' + (product.expDate)}><span><ClockCircleOutlined/> {product.expDate}</span></Tooltip>
                      </p>
                    </Card>
                  </List.Item>
                  )}
                />
            </Col>
            <Col span={8}>
              <Card title={
                <Tabs
                    defaultActiveKey={appState.typeOrder}
                    items={[
                      {
                        label: <Title level={4}>Cart <ShoppingCartOutlined/></Title>,
                        key: 'order',

                      },
                      {
                        label: <Title level={4}>Refund <RedoOutlined/></Title>,
                        key: 'refund',
                      },
                    ]}
                    onChange={setTypeOrder}
                />
              }>
                {
                  appState.typeOrder == 'order' && <>
                      { !appState.customerSelected &&
                          <AutoComplete
                              style={{width: '100%', marginBottom: 16}}
                              options={customerOptions}
                              onSearch={handleCustomerSearch}
                              onSelect={handleCustomerSelect}
                              className={"autocomplete-customer"}
                              placeholder="Insert phone number"
                          >
                          </AutoComplete>
                      }
                      {!!appState.customerSelected && (
                        <>
                          <div className='customer-info'>
                            <div><UserOutlined/> {appState.customerSelected?.label}</div>
                            <div><Tooltip title="Remove customer"><DeleteOutlined onClick={() => {
                              setSelectedCustomer(null);
                              setCustomerAddress('');
                            }} /></Tooltip></div>
                          </div>
                          <Input
                            placeholder="Enter customer address"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            style={{ marginTop: 8, marginBottom: 16 }}
                          />
                        </>
                      )}
                    </>
                }
                <List
                  dataSource={cart}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.medicine.name}
                        description={`$ ${item.medicine.price.toLocaleString(undefined, {maximumFractionDigits:2})}`}
                      />
                      <div className="flex items-center">
                        <Button
                          icon={<MinusOutlined/>}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          size="small"
                        />
                        <Input
                          className="mx-2 w-16 text-center"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value < 1) {
                              updateQuantity(item.id, 1);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              updateQuantity(item.id, item.quantity + 1);
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              updateQuantity(item.id, Math.max(1, item.quantity - 1));
                            }
                          }}
                        />
                        <Button
                          icon={<PlusOutlined/>}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          size="small"
                        />
                        <Button
                          icon={<DeleteOutlined/>}
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                          className="ml-2"
                          danger
                        />
                      </div>
                    </List.Item>
                  )}
                />
                <div className="mt-4">
                  {(appState.typeOrder == 'order' && !!appState.customerSelected?.points) &&
                      <Checkbox onChange={(v) => setUsePoint(v.target.checked)}
                                className={'check-box-points'} checked={appState.usePoint}>
                        Use {appState.customerSelected?.points?.toLocaleString(undefined, {maximumFractionDigits:2})} points
                      </Checkbox>
                  }
                  <Title level={4}>
                    <div className="flex justify-between">
                      <div>Total:</div>
                      <div className={'text-red-500'}>$ {getTotalPrice().toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                    </div>
                  </Title>
                  {appState.typeOrder == 'refund' &&
                      <Input.TextArea placeholder="Note" value={appState.noteRefund} autoSize onChange={(e) => {
                        setAppState({...appState, noteRefund: e.target.value})
                      }} style={{ marginBottom: '0.5rem' }} />
                  }
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handleCheckout}
                    disabled={
                      cart.length === 0 ||
                      (appState.typeOrder === 'order' && appState.customerSelected && customerAddress.trim() === '')
                    }
                    className={'w-full'}
                  >
                    {appState.typeOrder == 'refund' ? 'Refund' : 'Checkout'}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Modal
        title={'Create Customer'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <BaseForm isSubmitting={loading}
                  fields={customerFields()}
                  onFinish={handleFinishCustomer}
                  initialValues={{phoneNo: searchCustomer}}
        />
      </Modal>
    </Spin>
  );
}