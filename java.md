# Java Udemy course notes

## First steps

- Statement: It's a complete command to be executed
  - It can include one or more expressions
- Declaration statement: It defines a variable indicating the type, name, and optionally the value
- Expression: It's a coding construct that evaluates to a single value
  - It's the code segment that in on the right side of the equals sign in an assignment or declaration statement
- Keyword: It's a reserved word that has a predefined meaning in Java
- Variable: It stores some info in the computer memory (in the RAM)

### Primitive types (8)

All of them have their wrapper class, which olds further info from the type, like min and max value

- Whole number: byte (Byte.MIN_VALUE, Byte.MAX_VALUE), short, int, long (Long.MIN_VALUE, Long.MAX_VALUE)
  - For long values, use the letter L at the end of it, otherwise it will be transformed into an int by default
  - All of those types have overflow/underflow problem
- Real number: float, double
- Single character: char
- Boolean value: boolean

### Casting

(newType) (expression);

### Floating point numbers (float and double)

- For whole numbers, int is the default
- For floating, the double in the default
- Don't forget the F and the end for float numbers and D for double numbers
- Double is faster
- For precise calculations, use BigDecimal

### char (two bytes of memory)

- Use single quotes for char
- Use double quotes for strings
- char values don't get concatenated. Whats is added is their ASCII number
- 3 different ways to assign a value
  - char myChar = 'D';
  - char myChar = '\u0044';
  - char myChar = 68;

### String

A class that contains a sequence of chars

StringBuilder class is better suited to string concatenation

Scape sequences

| Scape sequence | Description                     |
| -------------- | ------------------------------- |
| \t             | Insert a tab character          |
| \n             | Insert a new line character     |
| \\"            | Insert a double quote character |
| \\             | Insert a backslash character    |

### Text block

- It is a multi-line string literal
- It has 3 \\"
- You format the output as you write

```java
String textBlock = """
    First line
    Second line
    Third line""";
```

### String format specifiers

`%[argument_index$][flags][width][.precision]conversion`

| Conversion | Argument category |
| ---------- | ----------------- |
| s          | string            |
| d          | integer           |
| c          | char              |
| f          | floating point    |
| n          | new line          |
| %          | percent           |

- For outputting, use `System.out.printf()`
- For strings, use `.formatted()` on the string literal

```java
String something = "Hi. My name is %s. I'm %d years old".formatted("Isaac", 27);
```

### String methods (over 60)

- Inspection methods
  - length
  - charAt
  - indexOf
  - lastIndexOf
  - isEmpty => `returns true if length is zero`
    - `" ".isEmpty() // returns false`
  - isBlank => `returns true if length is zero or the string only contains whitespace characters` ⬅️
    - You normally want to use `isBlack`
    - `" ".isBlank() // returns true`
- Comparison methods
  - contentEquals
  - equals ⬅️
  - equalsIgnoreCase ⬅️
  - contains ⬅️
  - startsWith
  - endsWith
  - regionMatches
- Manipulation methods
  - indent => adds or removes spaces
  - strip ⬅️ use it instead of trim
  - trim
  - toLowerCase
  - toUpperCase
  - concat
  - join
  - repeat
  - replace
  - subString
  - subSequence

### StringBuilder

- Act on the original string
- You don't need to reassign it
- It's like the methods from JS that change the original array

### Method

- A method that doesn't return anything is called a procedure
- A method signature is the number and the type of the parameters
  - A signature is unique, not just by the method name, but in combination with the number of parameters, their types, and the order in which they are declared
  - A method signature doesn't include the return type nor the parameter name
- Use method overload for handling default parameters

### Switch

- Valid switch value [switch(value)]
  - byte, short, int, char
  - Byte, Short, Integer, Char
  - String
  - enum
- long, float, double, or boolean and their wrappers can't be used

### var

- `var` is a special contextual keyword in Java that takes advantage of local variable type inference
- You don't need to assign a type to the variable

### Checking runtime type with `instanceof`

```java
Object unknown = Movie.getMovie("Title", "Type");
if (unknown instanceof Advanture) {
  Advanture unknown = (Advanture) unknown;
  advanture.showMovie();
}
```

### `instanceof` with pattern matching

Creates a local variable correctly typed without casting

```java
Object unknown = Movie.getMovie("Title", "Type");
if (unknown instanceof Advanture advanture) {
  advanture.showMovie();
}
```

#### Enhanced switch statements

- No brake needed
- No colon after case value
- More readable
- You can return the switch
  - For the return at a default in a code block, use `yield` as it it were a return

```java
switch (switchValue) {
  case 1 -> System.out.println("case 1");
  case 2 -> System.out.println("case 2");
  case 3, 4, 5 -> {
    System.out.println("case 3 4 5");
    System.out.println("New switch, but still similar to JavaScript");
  }
  default -> System.out.println("Default");

}
```

## OOP

A class is a template for creating objects

You create an object by instantiating a class

Object and instance are interchangeable

`this` refers to the instance that was created when the object was instantiated

### Keywords

- `static`
  - Value of the field is stored in special memory location and only in one place
  - Accessed by ClassName.fieldName
  - It doesn't belong to the object, but to the class
  - A static method can't reference any of the instance members (fields or methods)
  - Whenever you see a method that don't use the instance variables, it should probably be declared as a static method
  - Common uses:
    - Storing counters
    - Generating unique ids
    - Storing a constant value
    - Creating and controlling access to a share resource
- `null`
  - It means the variable or attribute has a type, but no reference to an object
  - For primitive data types, they receive their default value
    - boolean => false
    - byte, short, int, long => 0
    - float, double => 0.0

### Constructor

A function that is called when the object is instantiated

If a class has no constructor, the default constructor is implicitly declared

The default constructor has no args (no-args constructor)

If a class has any other constructor, then de default one is not implicitly declared

#### Constructor overloading

It's the same than function overloading, but for constructors

#### Constructor chaining

When one constructor calls another overloaded constructor

You can call a constructor only from another constructor

You must use the special statement `this()` to execute another constructor, passing arguments if required

`this()` must be the first executable statement, if it's used from another constructor

### Packages

Classes can be organized into logical groupings called packages

If you don't declare a package, the class implicitly belongs to the default package

### Access modifiers

Access modifiers in Java are used to set the visibility and accessibility of classes, methods, and variables

- `public`
  - The public keyword allows a class, method, or variable to be accessible from any other class in your application
- `private`
  - The private keyword restricts the accessibility of a class, method, or variable to its own class
- `protected`
  - The protected keyword allows a class, method, or variable to be accessible within its own package and by subclasses in other packages
- In Java, if you do not specify an access modifier, it defaults to package-private, which allows a class, method, or variable to be accessible within its own package

### Top-level class

A class defined in the source code file, and not enclose in the code block of another class, type, or modified

It has only 2 access modifiers" `public` or none [default] (omitted modifier, meaning the class is accessible only to classes in the same package)

### POJO (plain old Java object)

A class that generally has only instance fields

Used to store and pass data between functional classes

It also might be called a bean, or JavaBean

Another acronym is DTO, data transfer object

Sometimes also called an Entity, because it reflect the database entities

Many frameworks use POJO's to read data from or write data to databases, files, or streams

### Record (JDK >= 16)

It removes the boiler plate that POJO has, but to be more restrictive

Java calls them "plain data carriers"

Record is a special class that contains data that's not supposed to be changed

It creates the fields and the getters

Fields (component field) are private and final

### Encapsulation

- Hiding of fields and some methods from public access
- Easier to debug, because you know where and when the field was changed
- Bundling of fields and methods on a single object
- Normally, the fields are private. So you create getters and setters to handle those fields

### Inheritance

- Code reuse
- Organize classes into a parent-child hierarchy
  - Child inherits fields and methods from its parent
- A child can have only one direct parent, but it inherit from the parent class's parent, an so on
  - Only one class ofter `extends`
- `super()` calls the constructor of the parent class
  - like `this()`, `super()` has to be the first statement of the constructor
  - `this()` and `super()` can never be called from the same constructor
  - if you don't male a call to `super()`, than Java makes it for you, calling the super's default constructor

#### `java.lang.Object`

Every class and array inherits from `Object`

`hashCode()` is unique among class instances

### Polymorphism

- It means many forms
- When a child class overrides a parent class to make a new implementation of a method

### Composition

A class that is made out of other classes

Prefer composition over inheritance

Inheritance breaks encapsulation, because subclasses may need direct access to a parent's state or behavior

## Java intellij conf

- Editor > general >
  - auto import >
    - select add unambiguous imports on the fly and optimize imports on the fly
  - code folding >
    - General > unselect file header and imports
    - Java > unselect one-line methods, closures, and generic constructors and method parameters
