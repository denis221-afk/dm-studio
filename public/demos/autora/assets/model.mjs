export const cars=[
 {id:'bmw4',name:'BMW M5',brand:'BMW',year:2021,fuel:'petrol',engine:2,mileage:54000,status:'auction',image:'bmw.jpg',price:14500,repair:1800,body:'Седан',note:'Приклад преміального седана для комфортних поїздок.'},
 {id:'tesla3',name:'Tesla Model 3',brand:'Tesla',year:2022,fuel:'electric',engine:0,mileage:48000,status:'transit',image:'tesla.jpg',price:13000,repair:1500,body:'Седан',note:'Приклад електромобіля для міста та щоденних маршрутів.'},
 {id:'mustang',name:'Ford Mustang',brand:'Ford',year:2020,fuel:'petrol',engine:2.3,mileage:62000,status:'ukraine',image:'mustang.jpg',price:16000,repair:2400,body:'Купе',note:'Приклад емоційного автомобіля для вихідних та подорожей.'},
 {id:'porsche',name:'Porsche Panamera',brand:'Porsche',year:2019,fuel:'petrol',engine:3,mileage:39000,status:'auction',image:'porsche.jpg',price:42000,repair:4000,body:'Ліфтбек',note:'Приклад спортивного автомобіля з бюджетом окремого класу.'}
];
export const fuelLabels={petrol:'Бензин',diesel:'Дизель',electric:'Електро'};
export const statusLabels={auction:'На аукціоні',transit:'У дорозі',ukraine:'В Україні'};
export function calculate({price,fuel,year,engine,repair},currentYear=new Date().getUTCFullYear()){
 const p=Number(price),y=Number(year),e=Number(engine),r=Number(repair);
 if(!Number.isFinite(p)||p<500||p>150000||!Number.isInteger(y)||y<1990||y>currentYear||!['petrol','diesel','electric'].includes(fuel)||!Number.isFinite(r)||r<0||r>50000||(fuel!=='electric'&&(!Number.isFinite(e)||e<.6||e>8)))throw new Error('Перевір ціну авто, рік, двигун і резерв на ремонт.');
 const auction=Math.round(p*.075+350),shipping=2400,age=Math.min(15,Math.max(1,currentYear-y));
 // Transparent illustrative values only; this is deliberately NOT a production customs tariff.
 const customs=fuel==='electric'?Math.round(p*.12):Math.round((p+auction+shipping)*.3+e*age*(fuel==='diesel'?85:50));
 const service=900,total=p+auction+shipping+customs+service+r;
 return {price:p,auction,shipping,customs,service,repair:r,total};
}
export function filterCars(input,{status='all',search='',sort='default',saved=[]}={}){const q=search.trim().toLocaleLowerCase('uk-UA');const rows=input.filter(c=>(status==='all'||(status==='saved'?saved.includes(c.id):c.status===status))&&(`${c.name} ${c.year}`.toLocaleLowerCase('uk-UA').includes(q)));if(sort==='price')rows.sort((a,b)=>calculate(a).total-calculate(b).total);if(sort==='year')rows.sort((a,b)=>b.year-a.year);return rows;}
export function lotUrl(raw){if(!raw.trim())return '';let u;try{u=new URL(raw);}catch{throw new Error('Введи коректне посилання на Copart або IAA.');}if(u.protocol!=='https:'||u.username||u.password||!['copart.com','www.copart.com','iaai.com','www.iaai.com'].includes(u.hostname))throw new Error('Потрібне HTTPS-посилання з copart.com або iaai.com.');return u.href;}
export const money=n=>new Intl.NumberFormat('uk-UA',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
