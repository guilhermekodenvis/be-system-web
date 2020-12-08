/* eslint-disable indent */
export default function typeToCashierMovimentName(type: number): string {
	switch (type) {
		case 0:
			return 'Abertura'
			break
		case 1:
			return 'Débito'
			break
		case 2:
			return 'Crédito'
			break
		case 3:
			return 'Dinheiro'
			break
		case 4:
			return 'Sangria'
			break
		case 5:
			return 'Troco'
			break
		case 6:
			return 'Fechamento'
			break
		default:
			'error'
	}
	return 'error'
}
