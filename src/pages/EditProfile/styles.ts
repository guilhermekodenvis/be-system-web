import styled from 'styled-components'

export const Container = styled.div`
	display: grid;
	grid-template-areas:
		'pic pic'
		'personal-data change-password';
`

export const ProfilePic = styled.div`
	grid-area: pic;
	justify-content: center;

	div {
		display: flex;
		align-items: baseline;
		justify-content: center;
	}

	img {
		width: 240px;
		height: 240px;
		border-radius: 50%;
		border: 2px solid #e36414;
	}

	label {
		transform: translateX(-60px) translateY(-24px);
		cursor: pointer;
		width: 60px;
		height: 60px;
		background: rgba(76, 96, 230, 0.71);
		border: 2px solid #4c60e6;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		input {
			display: none;
		}
	}
`

export const PersonalData = styled.div`
	grid-area: personal-data;
	width: 364px;
	justify-self: center;
	h2 {
		font-size: 24px;
		margin-bottom: 12px;
	}
`

export const ChangePassword = styled.div`
	grid-area: change-password;
	width: 364px;
	justify-self: center;
	h2 {
		font-size: 24px;
		margin-bottom: 12px;
	}
`
