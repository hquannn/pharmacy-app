import React, { useState } from 'react';
import { Input, Collapse, InputNumber, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import './Store.css';

const { Panel } = Collapse;
const { Option } = Select;

const categories = [
  'Thuốc kê đơn',
  'Thực phẩm chức năng',
  'Dụng cụ y tế',
  'Chăm sóc cá nhân',
  'Mẹ & Bé',
  'Khuyến mãi'
];

const units = [
  { label: 'VNĐ', value: 'vnd' },
  { label: 'USD', value: 'usd' }
];

const products = [
  {
    name: "Paracetamol 500mg",
    price: 25000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Giảm đau, hạ sốt.",
    category: 'Thuốc kê đơn'
  },
  {
    name: "Vitamin C 1000mg",
    price: 70,
    unit: 'usd',
    image: "https://via.placeholder.com/150",
    desc: "Tăng sức đề kháng.",
    category: 'Thực phẩm chức năng'
  },
  {
    name: "Khẩu trang y tế 4 lớp",
    price: 40000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Bảo vệ sức khỏe.",
    category: 'Dụng cụ y tế'
  },
  {
    name: "Sữa tắm em bé",
    price: 60000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Chăm sóc nhẹ dịu cho bé.",
    category: 'Mẹ & Bé'
  },
  {
    name: "Máy đo huyết áp",
    price: 650000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Kiểm tra huyết áp tại nhà.",
    category: 'Dụng cụ y tế'
  },
  {
    name: "Kem chống nắng",
    price: 120000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Bảo vệ làn da.",
    category: 'Chăm sóc cá nhân'
  },
  {
    name: "Combo khuyến mãi Vitamin",
    price: 100000,
    unit: 'vnd',
    image: "https://via.placeholder.com/150",
    desc: "Ưu đãi hấp dẫn.",
    category: 'Khuyến mãi'
  }
];

export default function Store() {

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  // Lọc giá
  const [filterPrice, setFilterPrice] = useState<number | undefined>(undefined);
  const [filterUnit, setFilterUnit] = useState<string>('vnd');

  // Hiển thị/collapse bộ lọc nâng cao
  const [filterOpen, setFilterOpen] = useState(false);

  // Lọc sản phẩm theo danh mục, từ khóa, giá
  const filteredProducts = products.filter((prod) => {
    // Lọc theo danh mục
    if (prod.category !== selectedCategory) return false;
    // Lọc theo search
    const kw = search.trim().toLowerCase();
    if (kw && !(
      prod.name.toLowerCase().includes(kw) ||
      prod.desc.toLowerCase().includes(kw)
    )) return false;
    // Lọc theo giá
    if (filterPrice !== undefined && prod.unit === filterUnit) {
      if (prod.price < filterPrice) return false;
    }
    // Nếu chọn đơn vị mà sản phẩm không cùng đơn vị thì bỏ qua
    if (filterUnit && prod.unit !== filterUnit) return false;
    return true;
  });
  
  

  return (
<div className="pharmacy-main-content">
      <div className="pharmacy-search-bar">
        <Input
          size="large"
          placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
        />
        <Button
          icon={<FilterOutlined />}
          style={{ marginLeft: 8 }}
          onClick={() => setFilterOpen(o => !o)}
        >
          Bộ lọc nâng cao
        </Button>
      </div>

      {filterOpen && (
        <div className="pharmacy-filter-box">
          <Collapse defaultActiveKey={['price']}>
            <Panel header="Giá bán" key="price">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>Giá thành</span>
                <InputNumber
                  min={0}
                  style={{ width: 120 }}
                  value={filterPrice}
                  onChange={v => setFilterPrice(v ? Number(v) : undefined)}
                  placeholder="Từ giá"
                />
                <Select
                  style={{ width: 80 }}
                  value={filterUnit}
                  onChange={setFilterUnit}
                >
                  {units.map(u => (
                    <Option key={u.value} value={u.value}>{u.label}</Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => {/* Áp dụng bộ lọc, state đã cập nhật, không cần làm gì thêm */}}
                >
                  Áp dụng
                </Button>
                <Button
                  onClick={() => { setFilterPrice(undefined); setFilterUnit('vnd'); }}
                >
                  Đặt lại
                </Button>
              </div>
            </Panel>
            <Panel header="Đối tượng sử dụng" key="target">
              {/* Tùy chỉnh thêm nếu muốn */}
            </Panel>
            <Panel header="Loại da" key="skin">
              {/* Tùy chỉnh thêm nếu muốn */}
            </Panel>
            <Panel header="Nước sản xuất" key="country">
              {/* ... */}
            </Panel>
            <Panel header="Chỉ định" key="indication">
              {/* ... */}
            </Panel>
            <Panel header="Thương hiệu" key="brand">
              {/* ... */}
            </Panel>
            <Panel header="Xuất xứ thương hiệu" key="brandOrigin">
              {/* ... */}
            </Panel>
          </Collapse>
        </div>
      )}

      <nav className="pharmacy-nav">
        {categories.map((cat) => (
          <a
            href="#"
            className={`nav-item${cat === selectedCategory ? ' active' : ''}`}
            key={cat}
            onClick={e => {
              e.preventDefault();
              setSelectedCategory(cat);
            }}
          >
            {cat}
          </a>
        ))}
      </nav>

      <section className="pharmacy-products">
        <h2>{selectedCategory}</h2>
        <div className="products-list">
          {filteredProducts.length === 0 && (
            <div style={{padding: 40, width: '100%', textAlign: 'center', color: '#888'}}>
              Không tìm thấy sản phẩm phù hợp.
            </div>
          )}
          {filteredProducts.map((prod) => (
            <div className="product-card" key={prod.name}>
              <img src={prod.image} alt={prod.name} />
              <h3>{prod.name}</h3>
              <p className="product-desc">{prod.desc}</p>
              <div className="product-price">
                {prod.unit === 'vnd'
                  ? `${prod.price.toLocaleString()} VNĐ`
                  : `${prod.price} USD`}
              </div>
              <button>Mua ngay</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
