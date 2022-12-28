import React from 'react';
import { Field } from 'formik';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import {
	Input,
	Form,
	Select,
	Cascader,
	Switch,
	Tag,
	Checkbox,
	InputNumber,
	notification,
	Upload,
	Button,
	DatePicker
} from 'antd';

import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import './style.scss';
import { CloseOutlined, DeleteFilled, DeleteTwoTone } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const { Option } = Select;
const { TextArea } = Input;

const generateComponent = (data) => {
	let {
		type,
		withTime,
		maxLength,
		allowFuture,
		timeConstraints,
		disabled,
		list,
		keyword,
		label,
		customLabel,
		placeholder,
		displayName,
		autoFocus,
		form: { touched, errors },
		form,
		field: { name },
		field,
		onChange,
		value,
		addOn,
		pinCount,
		pinValidate,
		handleOnBlur,
		handleOnChange,
		filterArray,
		customRenderer,
		identy,
		hidden,
		multiple,
		clearButton,
		customMenuRenderer,
		disableformValue,
		isLoading,
		minLength,
		hideDefaultOption,
		onSearch,
		isAsync,
		size,
		defaultValue,
		ranges,
		numberOfLines,
		required,
		visibleToggler,
		mode,
		showNow,
		minuteStep,
		prefix,
		disabledDate,
		...restProps
	} = data;
	onChange
		? (field = {
				...field,
				onChange
			})
		: null;
	value
		? (field = {
				...field,
				value
			})
		: null;

	let error = errors[name] && touched[name];
	let errorStatus = error && errors[name];
	const validateErrorStatus = () => {
		return errorStatus ? 'error' : 'success';
	};
	if (type === 'select') {
		let findObjectLabel;
		for (let objKey in list[0]) {
			if (list[0].hasOwnProperty(objKey)) {
				if (objKey == displayName) findObjectLabel = objKey;
			}
		}
		// list.sort((a, b) => {
		// 	var labelA, labelB;
		// 	if (findObjectLabel) {
		// 		for (let val in a) {
		// 			if (val == displayName) {
		// 				labelA = a[displayName] && a[displayName].toLowerCase();
		// 				labelB = b[displayName] && b[displayName].toLowerCase();
		// 				if (labelA < labelB) return -1;
		// 			}
		// 		}
		// 	} else {
		// 		labelA = a.toLowerCase();
		// 		labelB = b.toLowerCase();
		// 		if (labelA < labelB) return -1;
		// 	}
		// });
		let optionList = list.map((data, index) => {
			return (
				<Option key={index} value={keyword ? data[keyword] : data}>
					{displayName ? data[displayName] : data}
				</Option>
			);
		});
		return (
			<div id="select">
				<Form.Item
					label={label}
					required={required}
					validateStatus={validateErrorStatus()}
					help={error && errors[name]}
				>
					<Select
						{...field}
						showSearch
						allowClear={false}
						disabled={disabled}
						getPopupContainer={() => document.getElementById('select')}
						placeholder={!hideDefaultOption && <React.Fragment>{placeholder}</React.Fragment>}
						optionFilterProp="children"
						filterOption={(key, list) => {
							return list.children.toString().toLowerCase().indexOf(key.toString().toLowerCase()) >= 0;
						}}
						defaultValue={field.value || ''}
						onSearch={(value) => {
							form.setFieldValue(name, value);
						}}
						onChange={async (value) => {
							await form.setFieldValue(name, value);
							handleOnChange && handleOnChange(value);
						}}
						onBlur={async ({ target: { value } }) => {
							await form.setFieldTouched(field.name, true);
							handleOnBlur && handleOnBlur(value);
						}}
					>
						{!hideDefaultOption && <Option value="">{placeholder}</Option>}
						{optionList}
					</Select>
				</Form.Item>
			</div>
		);
	} else if (type == 'switch') {
		return (
			<div className="d-flex align-items-center">
				<Switch
					name={field.name}
					id={name}
					defaultChecked={field.value}
					onChange={async (checked) => {
						await form.setFieldValue(field.name, checked);
						handleOnChange && handleOnChange(checked);
					}}
				/>
				{label}
			</div>
		);
	} else if (type == 'file') {
		return (
			<Form.Item
				className="otp-section"
				label={label}
				validateStatus={validateErrorStatus()}
				required={required}
				help={error && errors[name]}
			>
				<Input
					{...field}
					type="file"
					placeholder={placeholder}
					disabled={disabled}
					className={`form-control ${errors[name] && touched[name] ? 'input-error' : ''} ${addOn
						? 'withAddon'
						: ''}`}
					autoFocus={autoFocus}
					onChange={async ({ target: { files, value } }) => {
						await form.setFieldValue(field.name, value);
						handleOnChange && handleOnChange(files[0]);
					}}
				/>
			</Form.Item>
		);
	} else if (type == 'image-upload') {
		const getBase64 = (file) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});

		return (
			<Form.Item
				label={label}
				validateStatus={validateErrorStatus()}
				required={required}
				help={error && errors[name]}
			>
				<ImgCrop rotate aspect={1.5 / 2}>
					<Upload
						listType="picture-card"
						showUploadList={false}
						beforeUpload={(file) => {
							const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
							const isLt2M = file.size / 1024 / 1024 < 0.15;
							if (!isJpgOrPng) {
								notification.error({
									message: 'Invalid Format',
									description: 'You can only upload JPG/PNG file!'
								});
							} else if (!isLt2M) {
								notification.error({
									message: 'Invalid Size',
									description: 'Image must smaller than 200KB!'
								});
							}
							return isJpgOrPng && isLt2M;
						}}
						onChange={(info) => {
							getBase64(info.file.originFileObj)
								.then(async (file) => {
									let base64Code = file.split(',')[1];
									await form.setFieldValue(field.name, base64Code);
									handleOnChange && handleOnChange(base64Code);
								})
								.catch((e) => {});
						}}
					>
						{field.value ? (
							<div>
								<img
									src={'data:image/png;base64,' + field.value}
									style={{
										width: '100%'
									}}
								/>
							</div>
						) : (
							<div className="p-2">
								Upload Passport photo PNG/JPEG format (max: 200Kb) 35 mm (W) x 45 mm (H)
							</div>
						)}
					</Upload>
				</ImgCrop>
				{/* {field.value && (
					<Button
						danger
						size="small"
						className="close-icon"
						onClick={async () => {
							await form.setFieldValue(field.name, '');
						}}
					>
						Remove Photo
					</Button>
				)} */}
			</Form.Item>
		);
	} else if (type == 'checkbox') {
		return (
			<Form.Item label={label} validateStatus={validateErrorStatus()} help={error && errors[name]}>
				<Checkbox
					id={name}
					defaultChecked={value}
					onChange={async ({ target: { checked } }) => {
						await form.setFieldValue(field.name, checked);
						handleOnChange && handleOnChange(checked);
					}}
				>
					{customLabel}
				</Checkbox>
			</Form.Item>
		);
	} else if (type == 'date') {
		return (
			<Form.Item
				label={label}
				required={required}
				validateStatus={errors[name] ? 'error' : 'success'}
				help={errors[name]}
			>
				<DatePicker
					{...field}
					size={size}
					format="DD/MM/YYYY"
					disabledDate={disabledDate || null}
					defaultValue={defaultValue}
					placeholder={placeholder}
					value={field.value}
					ranges={ranges}
					onChange={(value) => {
						form.setFieldValue(field.name, value);
						handleOnChange && handleOnChange(value);
					}}
					onBlur={() => {
						form.setFieldTouched(name, true);
					}}
				/>
			</Form.Item>
		);
	} else if (type == 'dateRange') {
		const { RangePicker } = DatePicker;
		return (
			<Form.Item
				label={label}
				required={required}
				validateStatus={errors[name] ? 'error' : 'success'}
				help={errors[name]}
			>
				<RangePicker
					{...field}
					size={size}
					defaultValue={defaultValue}
					value={field.value}
					ranges={ranges}
					onChange={(value) => {
						form.setFieldValue(field.name, value);
						handleOnChange && handleOnChange(value);
					}}
					onBlur={() => {
						form.setFieldTouched(name, true);
					}}
				/>
			</Form.Item>
		);
	} else if (type == 'multi-select') {
		let findObjectLabel;
		for (let objKey in list[0]) {
			if (list[0].hasOwnProperty(objKey)) {
				if (objKey == displayName) findObjectLabel = objKey;
			}
		}
		// list.sort((a, b) => {
		// 	var labelA, labelB;
		// 	if (findObjectLabel) {
		// 		for (let val in a) {
		// 			if (val == displayName) {
		// 				labelA = a[displayName] && a[displayName].toLowerCase();
		// 				labelB = b[displayName] && b[displayName].toLowerCase();
		// 				if (labelA < labelB) return -1;
		// 			}
		// 		}
		// 	} else {
		// 		labelA = a.toLowerCase();
		// 		labelB = b.toLowerCase();
		// 		if (labelA < labelB) return -1;
		// 	}
		// });
		let optionList = list.map((data, index) => {
			return {
				label: displayName ? data[displayName] : data,
				value: keyword ? data[keyword] : data
			};
		});
		optionList.unshift({
			label: 'Select All',
			value: 'all'
		});

		return (
			<div id="multi-select">
				<Form.Item
					label={label}
					required={required}
					validateStatus={validateErrorStatus()}
					help={error && errors[name]}
				>
					<Select
						{...field}
						mode="multiple"
						className="multi-select"
						maxTagCount={5}
						showSearch
						allowClear={false}
						disabled={disabled}
						showArrow={true}
						getPopupContainer={() => document.getElementById('select')}
						placeholder={!hideDefaultOption && <React.Fragment>{placeholder}</React.Fragment>}
						optionFilterProp="label"
						filterOption={(key, list) => {
							return list.label.toString().toLowerCase().indexOf(key.toString().toLowerCase()) >= 0;
						}}
						defaultValue={field.value || ''}
						// onSearch={(value) => {
						// 	// form.setFieldValue(name, value);
						// }}
						onChange={async (value) => {
							console.log('value', value);
							if (value.includes('all')) {
								let allValue = optionList.map((opt) => opt.value);
								allValue.shift();
								await form.setFieldValue(name, allValue);
								handleOnChange && handleOnChange(allValue);
								console.log('allValue', allValue);
							} else {
								await form.setFieldValue(name, value);
								handleOnChange && handleOnChange(value);
							}
						}}
						onBlur={async ({ target: { value } }) => {
							await form.setFieldTouched(field.name, true);
							handleOnBlur && handleOnBlur(value);
						}}
						options={optionList}
					/>
				</Form.Item>
			</div>
		);
	} else if (type == 'textarea') {
		let maximizedRow = numberOfLines ? numberOfLines : 4;

		return (
			<Form.Item
				label={label}
				required={required}
				validateStatus={validateErrorStatus()}
				help={error && errors[name]}
			>
				<TextArea
					name={field.name}
					value={field.value}
					rows={numberOfLines ? numberOfLines : 1}
					autoSize={{ minRows: 2, maxRows: maximizedRow }}
					placeholder={placeholder}
					onChange={async ({ target: { value } }) => {
						await form.setFieldValue(field.name, value);
						handleOnChange && handleOnChange(value);
					}}
					onBlur={async ({ target: { value } }) => {
						await form.setFieldTouched(name, true);
						handleOnBlur && handleOnBlur(value);
					}}
				/>
			</Form.Item>
		);
	} else if (type == 'number') {
		return (
			<Form.Item
				label={label}
				validateStatus={validateErrorStatus()}
				required={required}
				help={error && errors[name]}
			>
				<InputNumber
					{...field}
					name={field.name}
					value={field.value}
					type={type}
					prefix={prefix}
					placeholder={placeholder}
					disabled={disabled}
					maxLength={maxLength ? maxLength : ''}
					autoFocus={autoFocus}
					onChange={async (value) => {
						await form.setFieldValue(field.name, value);
						handleOnChange && handleOnChange(value);
					}}
					onBlur={async (value) => {
						await form.setFieldTouched(name, true);
						handleOnBlur && handleOnBlur(value);
					}}
				/>
			</Form.Item>
		);
	} else {
		return (
			<Form.Item
				label={label}
				validateStatus={validateErrorStatus()}
				required={required}
				help={error && errors[name]}
			>
				{type === 'text' && (
					<Input
						name={field.name}
						value={field.value}
						autoCorrect="off"
						autoComplete="new-password"
						type={type}
						placeholder={placeholder}
						disabled={disabled}
						maxLength={maxLength ? maxLength : ''}
						autoFocus={autoFocus}
						onChange={async ({ target: { value } }) => {
							await form.setFieldValue(field.name, value);
							handleOnChange && handleOnChange(value);
						}}
						onBlur={async ({ target: { value } }) => {
							await form.setFieldTouched(name, true);
							handleOnBlur && handleOnBlur(value);
						}}
					/>
				)}
				{type === 'password' && (
					<Input.Password
						name={field.name}
						value={field.value}
						autoCorrect="off"
						autoComplete="new-password"
						type={type}
						placeholder={placeholder}
						visibilityToggle={visibleToggler}
						disabled={disabled}
						maxLength={maxLength ? maxLength : ''}
						autoFocus={autoFocus}
						onChange={async ({ target: { value } }) => {
							await form.setFieldValue(field.name, value);
							handleOnChange && handleOnChange(value);
						}}
						onBlur={async ({ target: { value } }) => {
							await form.setFieldTouched(name, true);
							handleOnBlur && handleOnBlur(value);
						}}
					/>
				)}
			</Form.Item>
		);
	}
};

const FormField = (props) => <Field {...props} component={generateComponent} />;

export default FormField;
