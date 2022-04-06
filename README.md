# ti
💡 Use it to manage local tasks

## ti - install
```shell
# file
ti /admin/temp/index.js
ti ./index.js

# folder
ti /admin/temp

# alias
ti -alias || -a temp ./index.js

# dependencies
ti -deps || -d axios&fs-extra ./index.js
```

## tr - run
```shell
tr temp
tr temp temp1 temp2
```

## tun - uninstall
```shell
tun temp
tun temp temp1 temp2
```
