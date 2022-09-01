import React from 'react';
import { Field } from 'formik';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Input, Form, Select, Cascader, Switch, Tag, Checkbox } from 'antd';

import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import './style.scss';

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
		list.sort((a, b) => {
			var labelA, labelB;
			if (findObjectLabel) {
				for (let val in a) {
					if (val == displayName) {
						labelA = a[displayName] && a[displayName].toLowerCase();
						labelB = b[displayName] && b[displayName].toLowerCase();
						if (labelA < labelB) return -1;
					}
				}
			} else {
				labelA = a.toLowerCase();
				labelB = b.toLowerCase();
				if (labelA < labelB) return -1;
			}
		});
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
						placeholder={
							!hideDefaultOption && (
								<React.Fragment>
									{translatedString('formField.select')} {placeholder}
								</React.Fragment>
							)
						}
						optionFilterProp="children"
						filterOption={(key, list) => {
							return list.children.toString().toLowerCase().indexOf(key.toString().toLowerCase()) >= 0;
						}}
						defaultValue={field.value && field.value}
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
						{!hideDefaultOption && (
							<Option value="">
								{translatedString('formField.select')} {placeholder}
							</Option>
						)}
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
	} else if (type == 'checkbox') {
		return (
			<div>
				<Checkbox
					name={field.name}
					type={type}
					defaultChecked={field.value}
					onChange={async ({ target: { checked } }) => {
						await form.setFieldValue(field.name, checked);
						handleOnChange && handleOnChange(checked);
					}}
				>
					{label}
				</Checkbox>
			</div>
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
	} else if (type == 'multiSelect') {
		let renderedValue = !_isEmpty(field.value)
			? field.value.map((field) => {
					if (typeof field === 'object' && field[identy]) {
						return field[identy];
					} else return field;
				})
			: [];
		let filteredOptions = field.value
			? list.filter((list) => !renderedValue.includes(list[identy] ? list[identy] : list))
			: list;
		let optionList = filteredOptions.map((options, index) => {
			return (
				<Option
					key={options[identy] ? options[identy] : index}
					option={options}
					label={options[displayName] ? options[displayName] : ''}
					value={options[identy] ? options[identy] : options}
				>
					{customMenuRenderer ? (
						customMenuRenderer(options)
					) : customRenderer ? (
						customRenderer(options)
					) : (
						options[displayName]
					)}
				</Option>
			);
		});
		const tagRender = (props) => {
			const { value, onClose, closable } = props;
			let tagValue = list.map((list) => {
				if (value === list[identy] || value === list) {
					return list[displayName] ? list[displayName] : list;
				}
			});

			return (
				<Tag key={value} closable={closable} onClose={onClose}>
					{tagValue}
				</Tag>
			);
		};

		return (
			<div id="multi-select">
				<Form.Item
					label={label}
					required={required}
					validateStatus={validateErrorStatus()}
					help={error && errors[name]}
				>
					<Select
						name={field.name}
						dropdownClassName={`${customMenuRenderer && !_isEmpty(filteredOptions) && 'menu-item'}`}
						mode={mode}
						multiple={multiple}
						loading={isLoading}
						disabled={disabled}
						value={renderedValue}
						placeholder={placeholder}
						tagRender={tagRender}
						optionLabelProp="label"
						showArrow={true}
						showSearch={true}
						getPopupContainer={() => document.getElementById('multi-select')}
						optionFilterProp="children"
						filterOption={(keyValue, list) => {
							const { option } = list;
							return !_isEmpty(filterArray)
								? (filterArray.includes('email') &&
										option.email &&
										option.email.toLowerCase().includes(keyValue.toLowerCase())) ||
									(filterArray.includes('firstName') &&
										option.firstName &&
										option.firstName.toLowerCase().includes(keyValue.toLowerCase())) ||
									(filterArray.includes('lastName') &&
										option.lastName &&
										option.lastName.toLowerCase().includes(keyValue.toLowerCase())) ||
									(filterArray.includes('phone') &&
										option.phone &&
										option.phone.toLowerCase().includes(keyValue.toLowerCase()))
								: list[displayName] === undefined
									? option[displayName] === undefined
										? option.toLowerCase().includes(keyValue.toLowerCase())
										: option[displayName].toLowerCase().includes(keyValue.toLowerCase())
									: list[displayName].toLowerCase().includes(keyValue.toLowerCase());
						}}
						onChange={(value) => {
							form.setFieldValue(name, value);
							handleOnChange && handleOnChange(value);
						}}
						onBlur={async ({ target: { value } }) => {
							form.setFieldTouched(name, true);
						}}
					>
						{optionList}
					</Select>
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
