export default {
	type: "object",
	properties: {
	  name: { type: 'string' },
	  email: { type: 'string' },
	  password: { type: 'string' },
	  passwordValidation: { type: 'string' },
	},
	required: ['name','email','password','passwordValidation']
  } as const;
  