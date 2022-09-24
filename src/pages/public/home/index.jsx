import React, { useEffect, useState, Suspense } from 'react';
import { List, Card, Image, Divider, Spin } from 'antd';
import { Formik, Form } from 'formik';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { constants } from '../../../utils/constants';
import chooseImage from '../../../assets/images/Choseimage.png';

const Home = () => {
	const navigate = useNavigate(),
		dispatch = useDispatch(),
		[ loader, setLoader ] = useState(false);

	const { staticVariables } = constants;
	const { Meta } = Card;
	useEffect(() => {
		staticVariables.branchList.map((item) => document.body.classList.remove(item.id.toLowerCase()));
	}, []);
	return (
		<div className="container-fluid container-xl home">
			<Spin spinning={loader}>
				<Divider orientation="left">
					<img style={{ height: 100 }} src={chooseImage} />
				</Divider>
				<List
					grid={{ xxl: 5, xl: 5, lg: 5, md: 3, sm: 2, xs: 2 }}
					dataSource={staticVariables.branchList}
					renderItem={(item) => (
						<List.Item>
							<Card
								hoverable
								style={{ margin: 5, borderRadius: 8 }}
								cover={<img style={{ padding: 3 }} alt={item.name} src={item.url} />}
								onClick={() => {
									document.body.classList.add(item.id.toLowerCase());
									navigate(`/${item.id}`);
								}}
							>
								<Meta title={item.name} />
							</Card>
						</List.Item>
					)}
				/>
				<Divider plain orientation="right">
					Copyright © 2020 AE Enterprises. All rights reserved.
				</Divider>
			</Spin>
		</div>
	);
};

export default Home;
