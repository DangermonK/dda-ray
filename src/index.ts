
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

	private _pos: IVector;
	private _posLast: IVector;
	private readonly _vec: IVector;

	private _gridPos: IVector;

	private readonly _dir: IVector;

	private readonly _vectorAxisLength: IVector;

	private _step: IVector;

	constructor(pos: IVector, vec: IVector) {
		this._pos = pos;
		this._posLast = pos;
		this._vec = vec;

		this._gridPos = {
			x: Math.floor(pos.x),
			y: Math.floor(pos.y)
		};

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
			y: vectorXLength(vec),
		};

		this._step = {
			x: this._vectorAxisLength.x * cellPos.x,
			y: this._vectorAxisLength.y * cellPos.y
		};
	}

	next(): { pos: IVector, cell: IVector } {
		let output: { pos: IVector, cell: IVector };
		if(this._step.x < this._step.y) {
			const sV = scaleVector(this._vec, this._step.x);
			this._step.x += this._vectorAxisLength.x;
			output = {
				pos: {
					x: this._pos.x + sV.x,
					y: this._pos.y + sV.y},
				cell: {
					x: this._gridPos.x,
					y: this._gridPos.y}
			};
			this._gridPos.x += this._dir.x;
		} else {
			const sV = scaleVector(this._vec, this._step.y);
			this._step.y += this._vectorAxisLength.y;
			output = {
				pos: {
					x: this._pos.x + sV.x,
					y: this._pos.y + sV.y},
				cell: {
					x: this._gridPos.x,
					y: this._gridPos.y}
			};
			this._gridPos.y += this._dir.y;
		}

		return output;
	}

}

export class DDALine extends DDARay {

	private readonly _target: IVector;

	constructor(pos: IVector, target: IVector) {
		super(pos, {
			x: target.x - pos.x,
			y: target.y - pos.y
		});

		this._target =  {
			x: Math.floor(target.x),
			y: Math.floor(target.y)
		}
	}

	next(): { pos: IVector; cell: IVector; end: boolean; } {
		const output = super.next();

		return {
			...output,
			end: output.cell === this._target;
		}
	}

}
