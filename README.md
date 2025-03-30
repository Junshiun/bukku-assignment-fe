# WAC System

This system can be used to track purchases and sales records, and calculating the cost for each of the sales record, using Weighted Average Cost (WAC) method.
###
![alt text](https://drive.usercontent.google.com/download?id=1hOAtYoE38I6ziCUY0Ipp5BgdRhEXQ7zs)
###

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Junshiun/bukku-assignment-fe.git
    cd bukku-assignment-fe
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server, and you can access the application in your browser at the URL displayed in the terminal (usually `http://localhost:5173/`).

## Features

* **Record Purchase Transaction:**
    * A form to add new purchase transaction, including date, purchase quantity and total cost (RM).
###
* **Purchase Transactions Listing:**
    * Displays a list of purchase transactions, each with info:
	    * Date
	    * ID
	    * Quantity
	    * Cost / Unit (RM)
	    * Total Cost (RM)
	    * WAC (Cumulative) (RM)
###
* **Record Sales Transaction:**
    * A form to add new sales transaction, including date, quantity, and total amount (RM).
###
* **Sales Transactions Listing:**
    * Displays a list of all recorded sales transactions, including:
        * Date
        * ID
        * Quantity
        * Sales Price / Unit (RM)
        * Total Amount (RM)
        * Total Cost (RM)

## User Guide

1.  **Purchase Transactions:**
    * The page will show "Purchases" section by default. User can navigate to "Purchases" section by selecting "Purchases" tab on top of the page.
    * Enter the date, quantity, and total cost (RM) to add a new purchase transaction.
    * Click the “Add Purchase” button to save the purchase transaction.
    * The list of purchase transactions will be displayed.
###
2.  **Sales Transactions:**
    * User can navigate to "Sales" section by selecting "Sales" tab on top of the page.
    * Enter the date, quantity, and total amount (RM) to add a new sales transaction.
    * Click the “Add Sales” button to save the sales transaction.
    * The list of sales transactions will be displayed below the input form.
###
 3.  **Edit Transactions:**
	* All transactions added can be edited. New stock amount, total stock value and WAC will be calculated after editing.
	* In transaction list, user can click on "Pen" icon in the "Action" column in each transaction to start editing.
	* After editing, user can select "Tick" icon in "Action" column to save the changes, or "Cross" icon in the "Action" column to discard the changes.
###
4.  **Delete Transactions:**
	* All transactions added can be deleted. New stock amount, total stock value and WAC will be calculated after editing.
	* In transaction list, user can click on "Delete" icon in the "Action" column in each transaction to delete.
	* User can select "Tick" icon in "Action" column to confirm the deletion, or "Cross" icon in the "Action" column to not delete the transaction.
###
5.  **Validation:**
	* There are validation for adding, editing and deleting a transaction. Error message will appear on screen when there are any illogical transaction identified.
###
6.  **Latest WAC and Stock Quantity:**
	* Current WAC and quantity of stock will be calculated and updated after each action.

## Links
**User  Guide Video:** https://www.youtube.com/watch?v=7WGNhYGswC4&ab_channel=Xun
###
**Live URL:** https://junshiun.github.io/bukku-assignment-fe/
