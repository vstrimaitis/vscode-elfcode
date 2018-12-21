export interface Keyword {
	name: string;
	description: string;
	snippet: string;
}

export const keywords: Keyword[] = [
	{
		name: "addi",
		description: "`addi a b c` - adds register `a` and value `b`, stores the result in register `c`.",
		snippet: "addi ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "addr",
		description: "`addr a b c` - adds register `a` and register `b`, stores the result in register `c`.",
		snippet: "addr ${1:register} ${2:register} ${3:destination}"
	},
	{
		name: "muli",
		description: "`muli a b c` - multiplies register `a` and value `b`, stores the result in register `c`.",
		snippet: "muli ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "mulr",
		description: "`mulr a b c` - multiplies register `a` and register `b`, stores the result in register `c`.",
		snippet: "mulr ${1:register} ${2:register} ${3:destination}"
	},
	{
		name: "bani",
		description: "`bani a b c` - bitwise AND of register `a` and value `b`, stores the result in register `c`.",
		snippet: "bani ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "banr",
		description: "`banr a b c` - bitwise AND of register `a` and register `b`, stores the result in register `c`.",
		snippet: "banr ${1:register} ${2:register} ${3:destination}"
	},
	{
		name: "bori",
		description: "`bori a b c` - bitwise OR of register `a` and value `b`, stores the result in register `c`.",
		snippet: "bori ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "borr",
		description: "`borr a b c` - bitwise OR of register `a` and register `b`, stores the result in register `c`.",
		snippet: "borr ${1:register} ${2:register} ${3:destination}"
	},
	{
		name: "seti",
		description: "`seti a b c` - stores value `a` in register `c`.",
		snippet: "seti ${1:value} 0 ${2:destination}"
	},
	{
		name: "setr",
		description: "`setr a b c` - copies content of register `a` to register `c`.",
		snippet: "setr ${1:register} 0 ${2:destination}"
	},
	{
		name: "gtir",
		description: "`gtir a b c` - sets register `c` to `1` if value `a` is greater than register `b` and `0` otherwise.",
		snippet: "gtir ${1:value} ${2:register} ${3:destination}"
	},
	{
		name: "gtri",
		description: "`gtri a b c` - sets register `c` to `1` if register `a` is greater than value `b` and `0` otherwise.",
		snippet: "gtri ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "gtrr",
		description: "`gtrr a b c` - sets register `c` to `1` if register `a` is greater than register `b` and `0` otherwise.",
		snippet: "gtrr ${1:register} ${2:register} ${3:destination}"
	},
	{
		name: "eqir",
		description: "`eqir a b c` - sets register `c` to `1` if value `a` is equal to register `b` and `0` otherwise.",
		snippet: "eqir ${1:value} ${2:register} ${3:destination}"
	},
	{
		name: "eqri",
		description: "`eqri a b c` - sets register `c` to `1` if register `a` is equal to value `b` and `0` otherwise.",
		snippet: "eqri ${1:register} ${2:value} ${3:destination}"
	},
	{
		name: "eqrr",
		description: "`eqrr a b c` - sets register `c` to `1` if register `a` is equal to register `b` and `0` otherwise.",
		snippet: "eqrr ${1:register} ${2:register} ${3:destination}"
	}
];

export const keywordExists = (name: string): boolean =>
	keywords.filter(kw => kw.name === name).length === 1;

export const getKeyword = (name: string): Keyword =>
	keywords.filter(kw => kw.name === name)[0];
