import React, { useState, useEffect } from 'react';

const Countdown = ({ targetTime = '' }) => {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer);
	}, [targetTime]);

	function calculateTimeLeft() {
		if (!targetTime) {
			return { hours: 0, minutes: 0, seconds: 0 };
		}

		const now = new Date();
		const [targetHour, targetMinute] = targetTime.split(':').map((str) => parseInt(str, 10));

		const target = new Date();
		target.setHours(targetHour, targetMinute, 0, 0); // Set target time to targetHour:targetMinute today

		if (now.getHours() > targetHour || (now.getHours() === targetHour && now.getMinutes() >= targetMinute)) {
			target.setDate(target.getDate() + 1); // If it's past targetTime, set target to tomorrow
		}

		const difference = target - now;

		if (difference <= 0) {
			return { hours: 0, minutes: 0, seconds: 0 };
		}

		const hours = Math.floor(difference / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((difference % (1000 * 60)) / 1000);

		return { hours, minutes, seconds };
	}

	return (
		<div>
			{timeLeft.hours >= 10 ? timeLeft.hours : '0' + timeLeft.hours}:{timeLeft.minutes >= 10 ? timeLeft.minutes : '0' + timeLeft.minutes}:
			{timeLeft.seconds >= 10 ? timeLeft.seconds : '0' + timeLeft.seconds}
		</div>
	);
};

export default Countdown;