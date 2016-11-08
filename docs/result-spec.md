# Result Spec

Here is the shape of the Object which is the result of parsing a script file:

```
app: {
    version: <string>,
    scriptVersion: <string>,
    build: <string>,
    professional: <boolean>
}
```

```
painting: {
    name: <string>, 
    width: <number>,
    height: <number>,
    dpi: <number>,
    maskEdgeMap: {
        width: <number>,
        height: <number>
    },
    author: <string>,
    scriptInfo: {
        name: <string>,
        comment: <string>,
        type: <string>,
        featureFlags: <number>
    },
    instructions: [
        ...
    ]
}
```