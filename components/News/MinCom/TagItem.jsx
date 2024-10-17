import { nanoid } from 'nanoid';

const TagItem = ({ arr }) => {
	return (
		<div className="pub-flex">
			{arr?.map((item) => {
				return (
					<div className="new-tag mr10" key={nanoid()}>
						{item}
					</div>
				);
			})}
		</div>
	);
};

export default TagItem;
