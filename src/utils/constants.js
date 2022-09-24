import SLESBP_Logo from '../assets/images/SLESBPimage.png';
import LEETMP_Logo from '../assets/images/LEETMPimage.png';
import SLESAK_Logo from '../assets/images/SLESAKimage.png';
import SLESKS_Logo from '../assets/images/SLESKSimage.png';
import WMA_Logo from '../assets/images/WMAimage.png';
export const constants = {
	userRole: {
		teacher: 'Teacher',
		admin: 'Admin',
		parent: 'Parent',
		transportManager: 'Transport Manager'
	},
	staticVariables: {
		branchList: [
			{
				id: 'SLESBP',
				name: "St. Andrew's School, Bowenpally",
				url: SLESBP_Logo,
				location: 'Hyderabad',
				address: {
					add1: 'Survey No. 52, Opp. Military Dairy Farm Road,',
					add2: 'Ranga Reddy Dist., Old Bowenpally, Secunderabad, 500 011.',
					email: 'contact.sas-bp@standrewsindia.com',
					phone: '+91 95508 38000',
					phone2: '+91 95020 59000'
				}
			},
			{
				id: 'LEETMP',
				name: "St. Andrew's School, Marredpally",
				url: LEETMP_Logo,
				location: 'Hyderabad',
				address: {
					add1: '222-B, West Marredpally,',
					add2: 'Secunderabad, 500 026.',
					email: 'sas-mp@standrewsindia.com',
					phone: ' 2780 0220',
					phone2: '2780 8788'
				}
			},
			{
				id: 'SLESKS',
				name: "St. Andrew's School, Keesara",
				url: SLESKS_Logo,
				location: 'Hyderabad',
				address: {
					add1: 'Survey No. 25/P, Ahmedguda, Keesara Mandal, ',
					add2: 'Medchal Dist, Telangana, 501 301.',
					email: ' contact.sas-ks@standrewsindia.com',
					phone: '+91 95509 23344',
					phone2: '+91 81067 86789'
				}
			},
			{
				id: 'SLESAK',
				name: 'Akira',
				url: SLESAK_Logo,
				location: 'Hyderabad',
				address: {
					add1: '222-B, West Marredpally,',
					add2: 'Secunderabad, 500 026.',
					email: 'akira@standrewsindia.com',
					phone: '+91 73373 30069'
				}
			},
			{
				id: 'WMA',
				name: 'Winmore Academy',
				url: WMA_Logo,
				location: 'Bangalore',
				address: {
					add1: 'Survey No. 13/1, Bhaktharahalli, Nadavati Post,',
					add2: 'Hoskote Taluk, Bengaluru – 560067',
					email: 'Info@winmoreacademy.com',
					phone: '+91 91484 49538'
				}
			}
		]
	}
};
