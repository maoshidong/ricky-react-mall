import { Button } from 'antd';
import ReactToPrint from 'react-to-print';
import useI18 from '~/hooks/useI18';

// 打印
const ReactToPrintCom = ({ componentRef }) => {
	const { iPrint } = useI18();

	return (
		<ReactToPrint
			trigger={() => (
				<div className="ghost-btn">
					<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn">
						<div className="pub-flex-center">
							<div className="sprite-icon4-cart sprite-icon4-cart-5-8"></div>
							<div className="ml10">{iPrint}</div>
						</div>
					</Button>
				</div>
			)}
			content={() => componentRef}
		/>
	);
};

export default ReactToPrintCom