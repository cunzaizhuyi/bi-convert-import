# bi-convert-import README

This is a plugin for syntax conversion of import statements. 

Sometimes you need to modify import statements, such as changing `import { a } from 'b'` to `const { a } = require('b');`. You can use this plugin for that purpose.


## Features

* change `require` statements to `import` statements;
* change `import` statements to `require` statements;

## Requirements

This plugin is only applicable to `TypeScript` and `JavaScript` files.

## Usage

### Mode1: Operate a file
1. Open a `JavaScript` or `TypeScript` file, right-click the mouse, and select "bi-convert-import" menu.
2. Based on your needs, select the "require2import" or "import2require" submenu.

### Mode2: Select code
1. Open a `JavaScript` or `TypeScript` file, select the code section of the import statement in the file. Right-click the mouse and choose "bi-convert-import".
2. Based on your needs, select the "require2import" or "import2require" submenu.


## For more information

* [Github](https://github.com/cunzaizhuyi/bi-convert-import)

**Enjoy!**
