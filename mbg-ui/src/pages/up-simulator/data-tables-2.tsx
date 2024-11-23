import DataTable, { createTheme, TableColumn } from 'react-data-table-component'
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

const paginationRowsPerPageOptions = [5,10,20,50]

// createTheme(
// 	'mbg',
// 	{
// 		text: {
// 			// primary: '#268bd2',
// 			// secondary: '#2aa198',
// 		},
//         rows: {
//             style: {
//                 fontSize: '8px',
//                 fontWeight: 400,
//                 // color: theme.text.primary,
//                 // backgroundColor: theme.background.default,
//                 // minHeight: '48px',
//                 // '&:not(:last-of-type)': {
//                 //     borderBottomStyle: 'solid',
//                 //     borderBottomWidth: '1px',
//                 //     borderBottomColor: theme.divider.default,
//                 // },
//             },
//         },
// 	},
// 	'light',
// );

// Reference: https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts
const customStyles = {
	rows: {
		style: {
			minHeight: '28px', // override the row height
            fontSize: '60%',
		},
	},
	headCells: {
		style: {
			paddingLeft: '8px', // override the cell padding for head cells
			paddingRight: '8px',
		},
	},
	cells: {
		style: {
			paddingLeft: '8px', // override the cell padding for data cells
			paddingRight: '8px',
		},
	},
    pagination: {
        style: {
            fontSize: '60%',
        },
        pageButtonsStyle: {
			height: '32px',
			width: '32px',
            padding: '4px',
        },
    },
};

export function DataTable2<TData>({ columns, data }: DataTableProps<TData>): JSX.Element {
    return (
        <DataTable
            columns={columns}
            data={data}
            highlightOnHover
            pointerOnHover
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            fixedHeader
            fixedHeaderScrollHeight='300px'
            customStyles={customStyles}
            // theme='mbg'
        />
    );
}

// const exampleColumns = [
// 	{
// 		name: 'Title',
// 		selector: row => row.title,
// 	},
// 	{
// 		name: 'Year',
// 		selector: row => row.year,
// 	},
// ];

// const exampleData = [
//   	{
// 		id: 1,
// 		title: 'Beetlejuice',
// 		year: '1988',
// 	},
// 	{
// 		id: 2,
// 		title: 'Ghostbusters',
// 		year: '1984',
// 	},
// ]

// export function DataTable2() {
// 	return (
// 		<DataTable
// 			columns={exampleColumns}
// 			data={exampleData}
//             highlightOnHover
//             pointerOnHover
//             pagination
//             paginationPerPage={5}
//             paginationRowsPerPageOptions={paginationRowsPerPageOptions}
//             fixedHeader
//             fixedHeaderScrollHeight='300px'
//             // theme='mbg'
//             customStyles={customStyles}
// 		/>
// 	);
// };
