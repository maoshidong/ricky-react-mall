import Link from 'next/link';

// 页面头部导航公共组件-带url跳转
const PageHeaderShadow = ({ tabActive, headNavArr, handleTabNav, isH1 = true }) => {
	return (
		<div className="pub-top-tabs pub-top-">
			<div className="ps-container">
				<div className="ps-tab-cart">
					<ul className="ps-tab-root">
						{headNavArr.map((item, index) => {
							return (tabActive == item?.tabLabel && isH1) ? (
								<li key={'tab' + index} className={'pl-0 pr-0 ps-tab-root-item ' + (tabActive == item?.tabLabel ? 'ps-tab-active' : '')}>
									<h1 onClick={(e) => handleTabNav(e, item, index)}>
										<Link href={item?.linkUrl || '#'}>
											<a className="pub-fontw">{item.name}</a>
										</Link>
									</h1>
								</li>
							) : (
								<li key={'tab' + index} className={'pl-0 pr-0 ps-tab-root-item ' + (tabActive == item?.tabLabel ? 'ps-tab-active' : '')}>
									<h2 onClick={(e) => handleTabNav(e, item, index)}>
										<Link href={item?.linkUrl || '#'}>
											<a className="pub-fontw">{item.name}</a>
										</Link>
									</h2>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default PageHeaderShadow