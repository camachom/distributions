## Approach

### Minimize dependencies
Packages with minimal dependencies are easier to maintain and reduce the attack surface. This package has 0 third-party dependencies. No need to `npm install`!

### Modularity
The project was designed so that distribution order can easily change. 
 
```javascript
// Each category must have classes participating
// and a monetary cap. Once the cap is exceeded, distribution
// continues to next category
krakatoa.distributionOrder = [
	{
		classes: [classB],
		cap: priorityRule(), // 500 in this case
	},
	{
		classes: [classA, classB, classC],
		cap: Infinity,
	},
];
```

## Running locally
This project was built using `Node` v14.0.0, but should also work with previous versions. Make sure you also have `npm` installed. 

After cloning the repo, run `npm link`. You can now run the CLI:
```
distribution 1000
```

If you would prefer not to install node, you can also use Docker. After cloning the repo, run `docker build -t distribution .`. You can now run the CLI:
```
docker run distribution 1000 
```

I have published a public npm package and Docker image for this project. I will not include them here because it would reveal my identity.

## Tradeoffs

Given more time, I would improve test coverage. I did write a couple of assertions, but they could be expanded. 