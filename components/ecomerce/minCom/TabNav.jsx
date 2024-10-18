import { nanoid } from "nanoid"

// 页面头部导航公共组件-不带url跳转
const TabNavCom = ({ tabActive, headNavArr, handleTabNav }) => {
	return (
		<div className='ps-tab-root'>
			{
				headNavArr?.map(item => {
					return <h2
						key={nanoid()}
						className={'ps-tab-root-item ' + (tabActive === item?.label ? 'ps-tab-active' : '')}
						onClick={(e) => handleTabNav(e, item)}
					>{item?.label}</h2>
				})
			}
		</div>
	)
}

export default TabNavCom