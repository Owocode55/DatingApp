export type User = {
  id: string;
  email: string;
  displayName: string;
  token: string;
  imageURL?: string;
  roles : string[]
};

export type UserCred = {
  email: string;
  password: string;
};


export type UserRegistration = {
  email: string;
  displayName : string;
  password: string;
  gender : string;
  dateOfBirth : string;
  city:string;
  country :string;

};


