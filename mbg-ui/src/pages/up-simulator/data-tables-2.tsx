import DataTable, { TableColumn } from 'react-data-table-component'
import { Sekolah } from './types';

export const sekolahColumns: TableColumn<Sekolah>[] = [
    {
        name: 'NPSN',
        selector: (row: Sekolah) => row.npsn,
        sortable: true,
    },
    {
        name: "Nama Sekolah",
        selector: (row: Sekolah) => row.name,
        sortable: true,
    },
    {
        name: "Bentuk Pendidikan",
        selector: (row: Sekolah) => row.bentuk_pendidikan,
        sortable: true,
    },
    {
        name: "Status Sekolah",
        selector: (row: Sekolah) => row.status_sekolah,
        sortable: true,
    },
    {
        name: "Jumlah Peserta Didik",
        selector: (row: Sekolah) => row.pd,
        sortable: true,
    },
]

interface DataTableProps<TData> {
    columns: TableColumn<TData>[];
    data: TData[];
}

export function DataTable2<TData>({ columns, data }: DataTableProps<TData>): JSX.Element {
    return (
        <DataTable
            title="Daftar sekolah"
            columns={columns}
            data={data}
            highlightOnHover
            pointerOnHover
            pagination
            fixedHeader
            fixedHeaderScrollHeight='300px'
        />
    );
}
