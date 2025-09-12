import { cx } from "class-variance-authority"
import { ClassValue } from "class-variance-authority/types"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(cx(inputs))

export const convertISODate = (date: string) => {
  return dayjs(date).format("YYYY/MM/DD HH:mm")
}

export const objectIsEmpty = (obj: Record<string, any>) => {
  for (const _ in obj) return false
  return true
}
const templateBill = `<!doctypehtml><html lang="en"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport"><title>Bill</title><style>body{font-family:'Courier New',Courier,monospace;line-height:1.4;margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:#f0f0f0}.receipt{background-color:#fff;width:300px;padding:20px;box-shadow:0 0 10px rgba(0,0,0,.1)}.footer,.header{text-align:center;margin-bottom:10px}.divider{border-top:1px dashed #000;margin:10px 0}.item{display:flex;justify-content:space-between}.item-price{text-align:right}.total{font-weight:700;margin-top:10px}img{text-align:center;height:100px;width:100px;object-fit:contain}@media print{@page{margin:0;size:auto}body{margin:0;padding:0;background-color:#fff}.receipt{width:100%;height:100%;box-shadow:none;font-size:12pt}.footer,.header,.item,.total{page-break-inside:avoid}}</style><body><div class="receipt"><div class="header"><h2>Pharmacy</h2><div class="divider"></div><p>{{orderCode}}</p><p>{{orderPayTime}}</p><div class="divider"></div>{{listItems}}<div class="divider"></div><div class="item total"><span>TỔNG</span><span>{{amount}}</span></div><div class="item"><span>THANH TOÁN</span><span>{{totalAmount}}</span></div><div class="divider"></div></div></div></body></html>`;

function generateListItemsHTML(listItems: any[]) {
  return listItems.map(item => `<div class="item"><div>${item.quantity} ${item.name}</div><div class="item-price"><div>${item.amount}</div></div></div>`).join('');
}
export function generateBill(params: any) {
  let updatedTemplate = templateBill;
  for (const key in params) {
    let v = params[key]
    if(key == 'listItems' && Array.isArray(params.listItems)) {
      v = generateListItemsHTML(params.listItems);
    }
    const regex = new RegExp(`{{${key}}}`, 'g');
    updatedTemplate = updatedTemplate.replace(regex, v);
  }

  return updatedTemplate;
}

export const formatDate = (date: any, format: string = 'YYYY-MM-DD') => {
  if (dayjs(date).isValid()) return dayjs(date).format(format);
};

