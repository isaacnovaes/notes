interface Person {
	name: string;
	age: number;
}

type People = {
	subscribe_james: Person;
	subscribe_kate: Person;
	subscribe_todd: Person;
	subscribe_tom: Person;
	chris: Person;
	timmy: Person;
};

type OnlySubscribed<T> = {
	[TKey in keyof T as TKey extends `subscribe${string}`
		? TKey
		: never]: T[TKey];
};

type ok = OnlySubscribed<People>;
//   ^?
