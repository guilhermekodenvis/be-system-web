import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }
  body {
    background: #1F1449;
    color: #E9E3FF;
    -webkit-font-smoothing: antialiased;
  }
  body, input, button {
    font-family: 'Play', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
		font-family: 'Kanit', sans-serif;
    font-weight: 500;
  }
  button {
    cursor: pointer;
  }

	#root {
		min-height: 100vh;
		min-width: 100vw;
		display: flex;
		flex-direction: column;
		padding: 0
	}


`
