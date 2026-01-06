import React from "react";
import { Tag, Typography, type MenuProps } from "antd";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { type Transaction, TransactionType } from "../types/finance";
import { COLORS } from "./index";

const { Text } = Typography;

export const FINANCE_COLUMNS = [
    {
        title: "Tarih",
        dataIndex: "date",
        key: "date",
        render: (date: string) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
        title: "Tip",
        dataIndex: "type",
        key: "type",
        render: (type: TransactionType) => (
            <Tag color={type === TransactionType.Income ? "green" : "red"}>
                {type === TransactionType.Income ? "Gelir" : "Gider"}
            </Tag>
        ),
    },
    { title: "Kategori", dataIndex: "category", key: "category" },
    { title: "Açıklama", dataIndex: "description", key: "description" },
    {
        title: "Tutar",
        dataIndex: "amount",
        key: "amount",
        align: "right" as const,
        render: (amount: number, record: Transaction) => (
            <Text
                strong
                style={{
                    color:
                        record.type === TransactionType.Income
                            ? COLORS.SUCCESS
                            : COLORS.ERROR,
                }}
            >
                {record.type === TransactionType.Income ? "+" : "-"} {amount} ₺
            </Text>
        ),
    },
];

export const getExportMenuItems = (
    onDownloadExcel: () => void,
    onDownloadPdf: () => void
): MenuProps["items"] => [
        {
            key: "excel",
            label: "Excel Olarak İndir",
            icon: <FileExcelOutlined style={{ color: "green" }} />,
            onClick: onDownloadExcel,
        },
        {
            key: "pdf",
            label: "PDF Olarak İndir",
            icon: <FilePdfOutlined style={{ color: "red" }} />,
            onClick: onDownloadPdf,
        },
    ];
