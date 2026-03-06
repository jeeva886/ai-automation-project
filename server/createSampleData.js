const xlsx = require('xlsx');

const data = [
    {
        "Product Name": "Wireless Noise-Canceling Headphones",
        "Product ID": "PROD-001",
        "Price": 199.99,
        "Quantity": 50,
        "Sales Current Week": 12,
        "Sales Previous Week": 8
    },
    {
        "Product Name": "Ultra HD 4K Smart TV",
        "Product ID": "PROD-002",
        "Price": 599.00,
        "Quantity": 15,
        "Sales Current Week": 3,
        "Sales Previous Week": 5
    },
    {
        "Product Name": "Ergonomic Office Chair",
        "Product ID": "PROD-003",
        "Price": 249.50,
        "Quantity": 30,
        "Sales Current Week": 8,
        "Sales Previous Week": 10
    },
    {
        "Product Name": "Mechanical Gaming Keyboard",
        "Product ID": "PROD-004",
        "Price": 129.99,
        "Quantity": 5,
        "Sales Current Week": 20,
        "Sales Previous Week": 15
    },
    {
        "Product Name": "Bluetooth Speaker with Bass Boost",
        "Product ID": "PROD-005",
        "Price": 89.00,
        "Quantity": 100,
        "Sales Current Week": 45,
        "Sales Previous Week": 30
    },
    {
        "Product Name": "Stainless Steel Water Bottle",
        "Product ID": "PROD-006",
        "Price": 25.00,
        "Quantity": 200,
        "Sales Current Week": 60,
        "Sales Previous Week": 55
    },
    {
        "Product Name": "Smartphone Stand with Fast Charging",
        "Product ID": "PROD-007",
        "Price": 45.00,
        "Quantity": 8,
        "Sales Current Week": 1,
        "Sales Previous Week": 0
    }
];

const worksheet = xlsx.utils.json_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

xlsx.writeFile(workbook, "SampleStock.xlsx");
console.log("SampleStock.xlsx created successfully.");
