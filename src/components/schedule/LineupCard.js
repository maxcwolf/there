import React, { Fragment, useState, useEffect } from 'react';
import { ReactComponent as Check } from '../../assets/checkIcon.svg';
import { ReactComponent as Star } from '../../assets/starIcon.svg';
import { ReactComponent as CloseIcon } from '../../assets/closeIcon.svg';
import { getItem, postItem } from '../../modules/apiManager';

export default ({ setId, user, isPublic }) => {
	const [artist, setArtist] = useState('Artist');
	const [stage, setStage] = useState('Stage');

	const getSet = () => { 
		getItem('artistsToEvents', `${setId}?&_expand=artist&_expand=stage`)
			.then(({ artist, stage }) => {
				setArtist(artist.name);
				setStage(stage.name);
			});
	};
	
	useEffect(getSet, []);

	const addToUserSchedule = attendance => {
		const item = {
			userId: user.id,
			artistsToEventId: setId,
			attendance
		};

		postItem('usersToArtistEvents', item);
	};

	const addToUserScheduleButtons =
		<Fragment>
			<Check className='dib pointer dim' onClick={() => addToUserSchedule('confirmed')}/>
			<Star className='dib pointer dim' onClick={() => addToUserSchedule('interested')}/>
		</Fragment>;

	return (
		<article>
			{isPublic ? addToUserScheduleButtons : null}
			<div className='dib'>
				<h6 className='dib'>{artist}</h6>
				<h6 className='dib'>{stage}</h6>
			</div>
			{!isPublic ? <CloseIcon className='dib pointer dim'/> : null}
		</article>
	);
};