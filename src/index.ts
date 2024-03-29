
export interface IVector {

	x: number,
	y: number

}

function scaleVector(vec: IVector, length: number) {
	const scale = length / magnitude(vec);
	return {
		x: scale * vec.x,
		y: scale * vec.y
	}
}

function magnitude(vec: IVector) {
	return Math.sqrt(vec.x*vec.x + vec.y*vec.y);
}

function vectorXLength(vec: IVector) {
	const m = vec.y/vec.x;
	return Math.sqrt(1 + m*m);
}

function vectorYLength(vec: IVector) {
	const m = vec.x/vec.y;
	return Math.sqrt(1 + m*m);
}

export class DDARay {

	protected _pos: IVector;
	private _posLast: IVector;
	private readonly _vec: IVector;

	private readonly _maxLength: number;

	private _gridPos: IVector;

	private readonly _dir: IVector;

	private readonly _vectorAxisLength: IVector;

	private _step: IVector;

	constructor(pos: IVector, vec: IVector, maxLength: number) {
		this._pos = pos;
		this._posLast = pos;
		this._vec = vec;
		this._gridPos = {
			x: Math.floor(pos.x),
			y: Math.floor(pos.y)
		};

		this._maxLength = maxLength;

		const cellPos = {
			x: pos.x - this._gridPos.x,
			y: pos.y - this._gridPos.y
		};

		this._dir = {
			x: vec.x < 0 ? -1 : 1,
			y: vec.y < 0 ? -1 : 1
		};

		cellPos.x = vec.x < 0 ? cellPos.x : 1 - cellPos.x;
		cellPos.y = vec.y < 0 ? cellPos.y : 1 - cellPos.y;

		this._vectorAxisLength = {
			x: vectorXLength(vec),
			y: vectorYLength(vec),
		};

		this._step = {
			x: this._vectorAxisLength.x * cellPos.x,
			y: this._vectorAxisLength.y * cellPos.y
		};
	}

	next(): { pos: IVector, cell: IVector, stop: boolean } {

		const scalar = Math.min(this._step.x, this._step.y, this._maxLength);
		const sV = scaleVector(this._vec, scalar);
		const output = {
			pos: {
				x: this._pos.x + sV.x,
				y: this._pos.y + sV.y},
			cell: {
				x: this._gridPos.x,
				y: this._gridPos.y},
			stop: scalar === this._maxLength
		};

		if(this._step.x < this._step.y) {
			this._step.x += this._vectorAxisLength.x;
			this._gridPos.x += this._dir.x;
		} else {
			this._step.y += this._vectorAxisLength.y;
			this._gridPos.y += this._dir.y;
		}

		return output;
	}

}

export class DDALine extends DDARay {

	constructor(pos: IVector, target: IVector) {
		const vector = {
			x: target.x - pos.x,
			y: target.y - pos.y
		}
		super(pos, vector, magnitude(vector));
	}

	next(): { pos: IVector; cell: IVector; stop: boolean; } {
		return super.next();
	}

}
