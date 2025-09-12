import { GET_REPORT_PROFIT_PER_DAY, GET_REPORT_SALE_CHART } from '@/api/report.api';
import useApi from '@/hooks/useApi';
import { Column, Line } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Flex, Row } from 'antd';
import { memo } from 'react';
import { TChart, TGetChart } from './Dashboard.type';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const Dashboard = () => {
    const { get } = useApi();
    const { data: getProftiPerDay, status: getProfitPerDayStatus } = useQuery({
        queryKey: ['getProfitPerday'],
        queryFn: () => get(GET_REPORT_PROFIT_PER_DAY)
    });
    const { data: getSaleChart, status: getSaleChartStatus } = useQuery<TGetChart[]>({
        queryKey: ['getSaleChart'],
        queryFn: () => get(GET_REPORT_SALE_CHART)
    });

    const amountData: Array<TChart> = [];
    const quantityData: Array<TChart> = [];

    const chartConfiguration = {
        yField: 'value',
        xField: 'month',
        style: {
            lineWidth: 2
        },
        colorField: 'category'
    };

    const lineConfiguration = {
        ...chartConfiguration
    };

    const columnConfiguration = {
        ...chartConfiguration,
        seriesField: 'category',
    };

    if (getSaleChart && getSaleChartStatus == 'success') {
        months.forEach(month => {
            getSaleChart.forEach((item: TGetChart) => {
                const {
                    amountOfRefund,
                    amountOfSale,
                    totalAmount,
                    quantityOfRefund,
                    quantityOfSale,
                    totalQuantity
                } = item;

                const common = {
                    month,
                    value: 0
                };

                const refundAmount = {
                    ...common,
                    category: 'Refund'
                };
                const saleAmount = {
                    ...common,
                    category: 'Sale'
                };
                const total = {
                    ...common,
                    category: 'Total'
                };

                const refundQuantity = {
                    ...common,
                    category: 'Refund'
                };
                const saleQuantity = {
                    ...common,
                    category: 'Sale'
                };
                const quantity = {
                    ...common,
                    category: 'Total'
                };

                if (month.toLowerCase() == item.month.toLowerCase()) {
                    refundAmount.value = amountOfRefund * -1;
                    saleAmount.value = amountOfSale;
                    total.value = totalAmount;
                    refundQuantity.value = quantityOfRefund;
                    saleQuantity.value = quantityOfSale;
                    quantity.value = totalQuantity;
                }

                amountData.push(refundAmount, saleAmount, total);
                quantityData.push(refundQuantity, saleQuantity, quantity);
            });
        });
    }

    let profitPerDay = 0;
    if (getProftiPerDay && getProfitPerDayStatus == 'success') {
        profitPerDay = getProftiPerDay.amount;
    }

    return (
        <Flex vertical className="h-full" gap={16}>
            <Row>
                <Col span={6}>
                    <Card title="Profit Per Day" loading={getProfitPerDayStatus == 'pending'}>
                        ${profitPerDay}
                    </Card>
                </Col>
            </Row>
            <Row className="flex-1" gutter={[16, 16]}>
                <Col xl={12} span={24} className="h-full">
                    <Card
                        title="Amount"
                        className="h-full"
                        loading={getSaleChartStatus == 'pending'}
                    >
                        <Line autoFit data={amountData} {...lineConfiguration} />
                    </Card>
                </Col>
                <Col xl={12} span={24} className="h-full">
                    <Card
                        title="Quantity"
                        className="h-full"
                        loading={getSaleChartStatus == 'pending'}
                    >
                        <Column autoFit data={quantityData} {...columnConfiguration} />
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
};

export default memo(Dashboard);
