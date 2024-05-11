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
