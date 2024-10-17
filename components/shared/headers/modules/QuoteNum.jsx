import React from 'react';
import Link from 'next/link';
import { ACCOUNT_QUOTE } from '~/utilities/sites-url';
import { helpersRfqQuantity } from '~/utilities/common-helpers';
import useLocalStorage from '~/hooks/useLocalStorage';

const QuoteNumCom = () => {
	const [quoteList] = useLocalStorage('quoteList', new Array(5).fill({}));

	return (
		<div>
			{helpersRfqQuantity(quoteList) > 0 && (
				<Link href={ACCOUNT_QUOTE}>
					<a className="mr20 pub-flex-align-center">
						<span className="mr5 header-icon-cart sprite-home-min sprite-home-min-1-7"></span>
						<span className="mb0 number-box link-number-box">{helpersRfqQuantity(quoteList)}</span>
					</a>
				</Link>
			)}
		</div>
	);
};

export default QuoteNumCom;
