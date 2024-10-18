import Link from "next/link"
import { useI18 } from "~/hooks"
import { getThousandsDataInt } from '~/utilities/ecomerce-helpers';
import styles from "./_NameNumCol.module.scss"
// name和数量布局
const NameNumColCom = ({ list = [] }) => {
	const { iItems } = useI18()
	return (
		<ul className={styles.nameNumCol}>
			{
				list?.map((item, index) => {
					return (
						<li key={index} className={styles.nameNumColItem}>
							<Link href={item?.href || '/'}>
								<a>
									<span className={styles.nameNumColItemName} title={item.name}>{item.name}</span>
									<span className={styles.num}>{getThousandsDataInt(item.number)} {iItems}</span>
								</a>
							</Link>
						</li >

					)
				})
			}
		</ul >
	)
}

export default NameNumColCom