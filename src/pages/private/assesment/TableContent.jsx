import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
// const originData = [];

// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`
						}
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const TableContent = ({ tableData }) => {
	const [ form ] = Form.useForm();
	const [ data, setData ] = useState(tableData);
	const [ editingKey, setEditingKey ] = useState('');
	const [ column, setColumn ] = useState([]);

	useEffect(
		() => {
			if (!_isEmpty(data)) {
				let title = Object.keys(data[0]);
				let firstObj = data[0];
				let tempColumn = [];
				title.map((ti, index) => {
					if (index < 4) {
						tempColumn.push({
							title: ti,
							dataIndex: ti,
							fixed: 'left',
							width: ti == 'Student Name' ? 200 : ti == 'Student ID' ? 120 : 80,
							key: ti.replace(' ', ''),
							align: ti == 'Student Name' ? 'left' : 'center',
							// ellipsis: true,
							render: (text) => <a className="p-1">{text}</a>
						});
					} else {
						let title = ti + '  (Max Marks:' + firstObj[ti] + ')';
						tempColumn.push({
							title,
							dataIndex: ti,
							key: ti.replace(' ', ''),
							align: 'center',
							width: 200,
							// ellipsis: true,
							editable: true
						});
					}
				});
				setColumn(tempColumn);
			}
		},
		[ data ]
	);

	const columns = [
		...column,
		{
			title: 'Operation',
			dataIndex: 'operation',
			width: 120,
			align: 'center',
			ellipsis: true,
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record['S No'])}
							style={{
								marginRight: 8
							}}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
						Edit
					</Typography.Link>
				);
			}
		}
	];

	const isEditing = (record) => {
		return record['S No'] === editingKey;
	};

	const edit = (record) => {
		let field = {};
		Object.entries(data[0]).forEach(([ key, value ], index) => {
			if (index > 3) {
				field[key.replace(' ', '')] = '';
			}
		});

		form.setFieldsValue({
			...field,
			...record
		});
		setEditingKey(record['S No']);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [ ...data ];
			const index = newData.findIndex((item) => key === item['S No']);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				setData(newData);
				console.log('newData', newData);
				setEditingKey('');
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record, rowIndex) => {
				return {
					record,
					// inputType: 'text', //col.dataIndex === 'age' ? 'number' : 'text',
					dataIndex: col.dataIndex,
					title: col.title,
					editing: isEditing(record),
					render: (_, record) => {
						return (
							<Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
								Edit
							</Typography.Link>
						);
					}

					// onChange: (e) => {
					// 	console.log(e.target.value);
					// 	if (e.target.value > 0 && e.target.value < 10) return e.target.value;
					// }
				};
				// return <Input />;
			}
		};
	});
	return (
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell
					}
				}}
				bordered
				dataSource={data.slice(1)}
				columns={mergedColumns}
				rowClassName="editable-row"
				scroll={{ y: 370, x: 1000 }}
				pagination={{ pageSize: 50 }}
				// pagination={{
				// 	onChange: cancel
				// }}
			/>
		</Form>
	);
};

export default TableContent;
