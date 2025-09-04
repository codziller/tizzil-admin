import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Button } from "components/General/Button";
import DateFilter from "components/General/DateFilter";
import Table from "components/General/Table";
import WalletCard from "components/General/WalletCard";
import RequestPayoutModal from "components/General/RequestPayoutModal";
import { ReactComponent as TotalBalanceIcon } from "assets/icons/total-balance-icon.svg";
import { ReactComponent as AmountWithdrawnIcon } from "assets/icons/amount-withdrawn-icon.svg";
import { ReactComponent as PendingPayoutIcon } from "assets/icons/pending-payout-icon.svg";
import WalletStore from "../store";

const WalletPage = () => {
  const {
    totalBalance,
    amountWithdrawn,
    pendingPayout,
    transactions,
    transactionsLoading,
    requestPayoutLoading,
    getWalletData,
    getTransactions,
    requestPayout,
  } = WalletStore;

  const [selectedDateFilter, setSelectedDateFilter] = useState({
    label: "All time",
    value: "all_time",
  });
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Sample transaction data
  const sampleTransactions = [
    {
      id: 1,
      receiver: "John Doe",
      type: "Transfer",
      bankName: "Access Bank",
      accountNumber: "1505667566",
      amount: 50000,
      date: new Date("2024-01-15"),
      status: "Completed",
    },
    {
      id: 2,
      receiver: "Jane Smith",
      type: "Transfer",
      bankName: "GTBank",
      accountNumber: "0123456789",
      amount: 75000,
      date: new Date("2024-01-10"),
      status: "Completed",
    },
    {
      id: 3,
      receiver: "Mike Johnson",
      type: "Transfer",
      bankName: "First Bank",
      accountNumber: "3012345678",
      amount: 30000,
      date: new Date("2024-01-05"),
      status: "Pending",
    },
  ];

  const displayTransactions =
    transactions.length > 0 ? transactions : sampleTransactions;

  // Table configuration for transactions
  const transactionColumns = [
    {
      name: "Receiver",
      minWidth: "20%",
      selector: (transaction) => (
        <span className="text-[14px] text-[#111827] font-medium">
          {transaction.receiver}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Type",
      minWidth: "15%",
      selector: (transaction) => (
        <span className="text-[14px] text-[#6D7280]">{transaction.type}</span>
      ),
      sortable: true,
    },
    {
      name: "Account Details",
      minWidth: "25%",
      selector: (transaction) => (
        <div className="flex flex-col">
          <span className="text-[14px] text-[#111827] font-medium">
            {transaction.bankName}
          </span>
          <span className="text-[12px] text-[#6D7280] mt-1">
            {transaction.accountNumber}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Amount",
      minWidth: "20%",
      selector: (transaction) => (
        <span className="text-[14px] font-bold text-[#690007]">
          ₦{transaction.amount?.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Date",
      minWidth: "20%",
      selector: (transaction) => (
        <span className="text-[14px] text-[#6D7280]">
          {moment(transaction.date).format("MMM DD, YYYY")}
        </span>
      ),
      sortable: true,
    },
  ];

  const handleRequestPayout = async (payoutData) => {
    try {
      await requestPayout(payoutData);
      setShowPayoutModal(false);
      // Show success message or refresh data
      console.log("Payout request submitted successfully");
    } catch (error) {
      console.error("Error requesting payout:", error);
    }
  };

  useEffect(() => {
    // Load wallet data and transactions on component mount
    getWalletData();
    getTransactions({ dateFilter: selectedDateFilter });
  }, [selectedDateFilter]);

  return (
    <div className="w-full h-full p-6">
      <div className="flex flex-col gap-6">
        {/* Title Section */}
        <div className="flex items-center justify-between w-full">
          <h1 className="text-[22px] font-bold text-[#111111]">Wallet</h1>

          <Button
            text="Request payout"
            onClick={() => setShowPayoutModal(true)}
          />
        </div>

        {/* Wallet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WalletCard
            icon={TotalBalanceIcon}
            label="Total Balance"
            value={`₦${totalBalance.toLocaleString()}.00`}
          />

          <WalletCard
            icon={AmountWithdrawnIcon}
            label="Amount Withdrawn"
            value={`₦${amountWithdrawn.toLocaleString()}.00`}
          />

          <WalletCard
            icon={PendingPayoutIcon}
            label="Pending Payout"
            value={`₦${pendingPayout.toLocaleString()}.00`}
          />
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-bold text-[#222B38]">
              Recent Transactions
            </h2>

            <DateFilter
              selectedOption={selectedDateFilter}
              onOptionChange={setSelectedDateFilter}
              placeholder="Filter by date"
              className="w-auto"
            />
          </div>

          {/* Transactions Table */}
          <Table
            data={displayTransactions}
            columns={transactionColumns}
            pointerOnHover
            isLoading={transactionsLoading}
            tableClassName="txn-section-table"
            noPadding
            title="Transactions"
            itemCount={displayTransactions.length}
            menuOptions={[
              {
                name: "Export Transactions",
                onClick: () => console.log("Export transactions"),
              },
              {
                name: "Filter by Date",
                onClick: () => console.log("Filter transactions"),
              },
            ]}
          />
        </div>
      </div>

      {/* Request Payout Modal */}
      <RequestPayoutModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSubmit={handleRequestPayout}
        isLoading={requestPayoutLoading}
      />
    </div>
  );
};

export default observer(WalletPage);
