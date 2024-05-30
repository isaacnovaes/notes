# Linux notes

- [Linux notes](#linux-notes)
  - [Linux was inspired by UNIX, but it is not UNIX](#linux-was-inspired-by-unix-but-it-is-not-unix)
  - [Linux terminology](#linux-terminology)
  - [Startup](#startup)
  - [Systemd](#systemd)
  - [File systems](#file-systems)
  - [Anatomy of a command](#anatomy-of-a-command)
  - [Set up sudo](#set-up-sudo)
  - [Basic commands](#basic-commands)
  - [I/O Redirection](#io-redirection)
    - [Example](#example)
  - [Appending to files](#appending-to-files)
  - [Pipe](#pipe)
  - [Finding files](#finding-files)
    - [`find`](#find)
    - [Advanced usage of find](#advanced-usage-of-find)
    - [`locate` same as `find`, but you need to update the fsdb](#locate-same-as-find-but-you-need-to-update-the-fsdb)
    - [Table: Wildcards](#table-wildcards)
  - [Process](#process)
    - [Killing a process](#killing-a-process)
  - [PLEASE, TEST `vimtutor`](#please-test-vimtutor)
  - [User environment](#user-environment)
  - [Order of startup files](#order-of-startup-files)
  - [Environment variables](#environment-variables)
    - [Add something to your PATH](#add-something-to-your-path)
  - [$PATH variable](#path-variable)
    - [prefix a private bin directory to your path](#prefix-a-private-bin-directory-to-your-path)
  - [~/.bash\_history](#bash_history)
  - [Keyboard shortcuts](#keyboard-shortcuts)
  - [File ownership (file/directory or group)](#file-ownership-filedirectory-or-group)
  - [chmod](#chmod)
  - [chown](#chown)
  - [chgrp](#chgrp)
  - [cat](#cat)
    - [cat interactively (`prefer echo` for single line input)](#cat-interactively-prefer-echo-for-single-line-input)
  - [echo](#echo)
  - [Reading files on IDEs is expensive](#reading-files-on-ides-is-expensive)
  - [sed (stream editor)](#sed-stream-editor)
  - [sort](#sort)
  - [uniq](#uniq)
  - [grep](#grep)
  - [Miscellaneous text utilities](#miscellaneous-text-utilities)
  - [Shell scripting](#shell-scripting)
    - [Use `#!/bin/bash` at the beginning of the file](#use-binbash-at-the-beginning-of-the-file)
    - [Arguments](#arguments)
    - [Function](#function)
  - [Command substitution (`Insert a command inside another one`)](#command-substitution-insert-a-command-inside-another-one)
  - [Constructs](#constructs)
    - [The ifs Statement](#the-ifs-statement)
      - [Examples if](#examples-if)
    - [elif statement](#elif-statement)
      - [Examples elif](#examples-elif)
      - [Table: Boolean for files](#table-boolean-for-files)
      - [Table: Boolean for numbers](#table-boolean-for-numbers)
      - [Table: Boolean for strings](#table-boolean-for-strings)
    - [Arithmetic expressions](#arithmetic-expressions)
  - [Command chaining operator](#command-chaining-operator)


## Linux was inspired by UNIX, but it is not UNIX

## Linux terminology

- kernel: brain of the OS, glue between the hardware and applications
- distribution: collection of software making up a Linux-based OS
- bootloader: program that boots the OS, like GRUB
- service: a program that runs as a background process, like httpd, nfsd
- desktop environment: gui on top of OS, like GNOME, KDE, Xfce
- shells: bash, zsh

## Startup

When the computer is powered on, the Basic Input/Output System (BIOS) initializes the hardware, including the screen and
keyboard, and tests the main memory. This process is also called POST (Power On Self Test)

The BIOS software is stored on a read-only memory (ROM) chip on the motherboard.

## Systemd

One systemd command (**_systemctl_**) is used for most basic tasks. Here is a brief listing of its use:

- Starting, stopping, restarting a **_service_** (using httpd, the Apache web server, as an example) on a currently
  running
  system:

```bash
sudo systemctl start|stop|restart httpd.service
```

- Enabling or disabling a system service from starting up at system boot:

```bash
sudo systemctl enable|disable httpd.service
```

- Checking on the status of a service:

```bash
sudo systemctl status httpd.service
```

In most cases, the .service can be omitted. There are many technical differences with older methods that lie beyond the
scope of our discussion.

## File systems

`Trash location: ~/.local/share/Trash`

If there is nothing in the trash, this directory does not exist

---

- GNOME is a popular desktop environment
- nautilus is the file manager
- gedit is the default text editor

## Anatomy of a command

`<comand_name> <options> <arguments>`

- Normally, options begin with one or two dashes

## Set up sudo

- su
- echo "user_name ALL=(ALL) ALL" > /etc/sudoers.d/user_name
- chmod 440 /etc/sudoers.d/user_name

## Basic commands

- `cat`
  - -n for displaying the line numbers
- `less` for analyzing big files
  - `SPACE` scroll down one full page
  - `ENTER` scroll down one line
  - `B` scroll up one full page
  - `Y` scroll up one line
- `tail` and `head`
  - -number for displaying the wanted lines
- `mv` does two things
  - move a file to a different location
  - rename a file
- `wc` for the following information of a file checking
  - number of lines
  - number of words
  - bytes
- `mkdir` and `rmdir` for working with directories
  - use -p for creating parent directories as well
  - use `rm -rfi` for deleting `non-empty` directories
    - `-f` force, `-i` interactively

## I/O Redirection

- Use a file as the input of a command (instead of typing in)

  ```bash
  do_something < input-file
  ```

- Take the output and write it into a file

  ```bash
  do_something > output-file
  ```

- Redirecting `stdout` and `stderr` `{0,1,2}>`

```bash
find /etc -name '*.config' > output.txt 2> error.txt
```

### Example

Doing everything at the same time

```bash
do_something < input-file > output-file
```

## Appending to files

Use `>>` to add a content to a file

`>` replaces the content of the file

## Pipe

- Pipe the output of one command or program into another as its input
- This is extraordinarily efficient because command2 and command3 do not have to wait for the previous pipeline commands
  to complete before they can begin processing at the data in their input streams

```bash
command1 | command2 | command3
```

## Finding files

### `find`

- It recurse down the filesystem tree from any particular directory (or set of directories) and locates files that match
  specified conditions. `The default pathname is always the present working directory`
- `-name` (only list files with a certain pattern in their name)
- `-iname` (also ignore the case of file names)
- `-type` (which will restrict the results to files of a certain specified type, such as `d` for directory, `l` for
  symbolic link, or `f` for a regular file, etc.).

Searching for files and directories named gcc:

`find /usr -name gcc`

Searching only for directories named gcc:

`find /usr -type d -name gcc`

Searching only for regular files named gcc:

`find /usr -type f -name gcc`

### Advanced usage of find

To find and remove all files that end with .swp:

`find -name "*.swp" -exec rm {} +`

- `-exec <command>`
  - command to executed on all files that the `find` found
- `{}` a placeholder for the founded files
- `+` obligatory, indicates the end of the command

Using `-ok` instead of `-exec` to prompt for permission to execute the command

Good for testing the command first

### `locate` same as `find`, but you need to update the fsdb

- `sudo updatedb`
- search files from `/`
- Sometimes it's useful to pipe it with `grep`, because it searches since `/`

### Table: Wildcards

| Wildcard | Result                                                                                                    |
|----------|-----------------------------------------------------------------------------------------------------------|
| ?        | Matches any single character                                                                              |
| \*       | Matches any string of characters                                                                          |
| [set]    | Matches any character in the set of characters, for example [adf] will match any occurrence of a, d, or f |
| [!set]   | Matches any character not in the set of characters                                                        |

To search for files using the ? wildcard, replace each unknown character with ?. For example, if you know only the first
two letters are 'ba' of a three-letter filename with an extension of .out, type ls ba?.out.

To search for files using the \* wildcard, replace the unknown string with \*. For example, if you remember only that
the extension was .out, type ls \*.out.

## Process

A process is simply an instance of one or more related tasks (threads) executing on your computer.

It is not the same as a program or a command. A single command may actually start several processes simultaneously

### Killing a process

At some point, one of your applications may stop working properly. How do you eliminate it?

To terminate a process, you can type
`kill -SIGKILL <pid>` or `kill -9 <pid>`

## PLEASE, TEST `vimtutor`

## User environment

- whoami
  - list current user
- who
  - list logged on users
  - `-a` print more info about those users

## Order of startup files

The standard prescription is that when you first log in to Linux, /etc/profile is read and evaluated, after which the
following files are searched (if they exist) in the listed order:

1. ~/.bash_profile
2. ~/.bash_login
3. ~/.profile

`The Linux login shell evaluates whatever startup file that it comes across first and ignores the rest`

However, every time you create a new shell, or terminal window, etc., you do not perform a full system login; only a
file named ~/.bashrc file is read and evaluated

`In Debian 12, only ~/.profile exists for full login. Then, ~/.bashrc is read for every terminal launch`

## Environment variables

- `type set, env, or export to see them`
  - env print what you want

By default, variables created within a script are only available to the current shell; child processes (sub-shells) will
not have access to values that have been set or modified. Allowing child processes to see the values requires use of
the `export`
command.

### Add something to your PATH

```bash
PATH=$PATH:new_addition_path
```

| Task                                  | Command                                                                                                                                                                       |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Show the value of a specific variable | echo $SHELL                                                                                                                                                                   |
| Export a new variable value           | export VARIABLE=value                                                                                                                                                         |
| `Add a variable permanently`          | `Edit ~/.bashrc and add the line export VARIABLE=value` <br/> <br/> type source ~/.bashrc or just . ~/.bashrc (dot ~/.bashrc); or `just start a new shell by typing **bash**` |

## $PATH variable

`PATH` is an ordered list of directories (the path) which is scanned when a command is given to find the appropriate
program or script to run

Each directory in the path is separated by colons (:). A null (empty) directory name (or ./) indicates the current
directory at any given time.

- :path1:path2
- path1::path2

In the example :path1:path2, there is a null directory before the first colon (:). Similarly, for path1::path2 there is
a null directory between path1 and path2

### prefix a private bin directory to your path

```bash
export PATH=$HOME/bin:$PATH
echo $PATH
```

## ~/.bash_history

Contains the commands used in the shell

## Keyboard shortcuts

| Keyboard shortcut | Task                                              |
|-------------------|---------------------------------------------------|
| CTRL-L            | Clears the screen                                 |
| CTRL-D            | Exits the current shell                           |
| CTRL-A            | Goes to the beginning of the line                 |
| CTRL-E            | Goes to the end of the line                       |
| CTRL-W            | Deletes the word before the cursor                |
| CTRL-U            | Deletes from beginning of line to cursor position |

## File ownership (file/directory or group)

In Linux and other UNIX-based operating systems, every file is associated with a user who is the owner. Every file is
also associated with a group (a subset of all users) which has an interest in the file and certain rights, or
permissions: read `(r)`, write `(w)`, and execute `(x)`.

| Command | Usage                                                                                                                                      |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| chown   | change ownership of a file or directory                                                                                                    |
| chgrp   | change group ownership                                                                                                                     |
| chmod   | Used to change the permissions on the file, which can be done separately for owner, group and the rest of the world (often named as other) |

Files have three kinds of permissions: read `(r)`, write `(w)`, execute `(x)`. These are generally represented as
in `rwx`. These permissions affect three groups of owners: user/owner `(u)`, group `(g)`, and others `(o)`

As a result, you have the following three groups of three permissions:

```bash
-rwxrwxrwx
 u  g  o
```

## chmod

- `4` if read permission is desired
- `2` if write permission is desired
- `1` if execute permission is desired

Thus, `7 means read/write/execute`, `6 means read/write`, and `5 means read/execute`.

When you apply this to the chmod command, you have to give three digits for each degree of freedom, such as in:

```bash
chmod 755 somefile
```

## chown

```bash
chown owner filename
```

## chgrp

```bash
chgrp group filename
```

## cat

It is often used to read and print files, as well as for simply viewing file contents

However, the main purpose of cat is often to combine (concatenate) multiple files together

| Command | Usage |
| ------------------------- | --------- |
| cat file1 file2 | Concatenate multiple files and display the output; <br> i.e. the entire content of the first file is followed by that of the second file |
| cat file1 file2 > newfile | Combine multiple files and save the output into a new file |
| cat file >> existingfile | Append a file to the end of an existing file |
| `cat > file`              | Any subsequent lines typed will go into the file, `until CTRL-D` is typed <br> If the file does not exist, it creates the file |
| `cat >> file`             | Any subsequent lines are appended to the file, `until CTRL-D` is typed <br> If the file does not exist, it creates the file |

### cat interactively (`prefer echo` for single line input)

`cat << STOP >> STOP`

- Append content into <filename> until STOP is typed

- Access to environment variables

## echo

- `echo string > newfile`
- `echo string >> newfile`

## Reading files on IDEs is expensive

For example, a system might maintain one simple large log file to record details of all system warnings and errors. (
Modern systems tend to have more fine-grained logging facilities but still may have some large logging files.) Due to a
security attack or a malfunction, the administrator might be forced to check for some data by navigating within the
file. In such cases, directly opening the file in an editor will probably be inefficient (due to high memory
utilization) because most text editors usually try to read the whole file into memory first. Instead, one can use less
to view the contents of such a large file, scrolling up and down page by page, without the system having to place the
entire file in memory before starting. This is much faster than using a text editor.

Use file utilities, like `less`, `tail`, `head`

## sed (stream editor)

The table explains some basic operations, where pattern is the current string and replace_string is the new string.

| Command                                | Usage                                                 |
|----------------------------------------|-------------------------------------------------------|
| sed s/pattern/replace_string/ file     | Substitute first string occurrence in every line      |
| sed s/pattern/replace_string/g file    | Substitute all string occurrences in every line       |
| sed 1,3s/pattern/replace_string/g file | Substitute all string occurrences in a range of lines |
| sed -i s/pattern/replace_string/g file | Save changes for string substitution in the same file |

`Instead of \, you can use #, @, :, or any character to separate the pattern and the replace_string`

You must use the -i option with care, because the action is not reversible. It is always safer to use sed without the –i
option and then replace the file yourself, as shown in the following example:

```bash
sed s/pattern/replace_string/g file1 > file2
```

The above command will replace all occurrences of pattern with replace_string in file1 and move the contents to file2.
The contents of file2 can be viewed with cat file2. If you approve, you can then overwrite the original file with mv
file2 file1.

## sort

sort is used to rearrange the lines of a text file, in either ascending or descending order according to a sort key

- `-u` remove duplicate lines from the output
- `-n` compare according to string numerical value

## uniq

uniq removes duplicate consecutive lines in a text file

- `-c` count duplicate lines
- `-d` only print duplicate lines

## grep

`grep options pattern <file_name>`

- `-i` case insensitive pattern
- `-n` print line number where the pattern exist
- `-v` print the lines where the pattern is not found
- `-C number` print context of lines (specified number of lines above and below the pattern) for matching the pattern

## Miscellaneous text utilities

- `tr char1 char2`
- `tee <filename>`
- `wc <filename>`

## Shell scripting

### Use `#!/bin/bash` at the beginning of the file

- `#` initiates a comment
- read `variable`
- echo `$variable`
- declaring a variable

```bash
VARIABLE=VALUE
```

- Declare a variable based on a command execution

```bash
 ORIG_DIR=$(pwd)
```

- `$?` gets the return statement of the previous execution

### Arguments

Passing arguments to scripts `./first-bash-script.sh isaac isael miriam`

| Parameter     | Meaning                       |
|---------------|-------------------------------|
| $0            | Script name                   |
| $1            | First parameter               |
| $2 , $3, etc. | Second, third parameter, etc. |
| $\*           | All parameters                |
| $#            | Number of arguments           |

### Function

- syntax

```bash
function_name () {
   echo This is a sample function that just displays the args $1, $2
}

# Call function_name and pass the args
function_name ARG1 ARG2
```

## Command substitution (`Insert a command inside another one`)

`$()`

```bash
ls /lib/modules/$(uname -r)/
```

## Constructs

### The ifs Statement

When an if statement is used, the ensuing actions depend on the evaluation of specified conditions, such as:

- Numerical or string comparisons
- Return value of a command (0 for success)
- File existence or permissions

```bash
if [[ condition ]] then
    statements
else
    statements
fi
```

#### Examples if

```bash
if [[ -f "$1" ]] then
    echo file "$1" exists
else
    echo file "$1" does not exist
fi
```

```bash
if [[ -d ~/Desktop/linux ]] then
    echo directory exists
else
    echo directory exists
fi
```

### elif statement

```bash
if [[ condition ]] ; then
    echo Passed test1
elif [[ condition ]] ; then
    echo Passed test2
else
    statement
fi
```

#### Examples elif

```bash
if [[ "$name" == "isaac" ]] ; then
  echo "Name doesn't start with an uppercase"
elif [[ "$name" == "isael" ]] ; then
  echo "Hello isael"
else
  echo "Hello miriam"
```

#### Table: Boolean for files

| Condition |Meaning                                                                                          |
|-----------|--------------------------------------------------------------------------------------------------|
| `-e` file | Checks if the file `exists`                                                                      |
| `-d` file | Checks if the file `is a directory`                                                              |
| `-f` file | Checks if the file `is a regular file`(i.e., not a symbolic link, device  node, directory, etc.) |
| `-s` file | Checks if the file `exists and is of non-zero size`                                              |
| `-r` file | Checks if the file `exists and is readable`                                                      |
| `-w` file | Checks if the file `exists and is writable`                                                      |
| `-x` file | Checks if the file `exists and is executable`                                                    |

#### Table: Boolean for numbers

| Condition               | Meaning                                         |
|-------------------------|-------------------------------------------------|
| INTEGER1 `-eq` INTEGER2 | INTEGER1 is `equal` to INTEGER2                 |
| INTEGER1 `-ge` INTEGER2 | INTEGER1 is `greater` than or equal to INTEGER2 |
| INTEGER1 `-gt` INTEGER2 | INTEGER1 is `greater` than INTEGER2             |
| INTEGER1 `-le` INTEGER2 | INTEGER1 is `less` than or equal to INTEGER2    |
| INTEGER1 `-lt` INTEGER2 | INTEGER1 is `less` than INTEGER2                |
| INTEGER1 `-ne` INTEGER2 | INTEGER1 is `not` equal to INTEGER2             |

#### Table: Boolean for strings

| Condition            | Meaning                           |
|----------------------|-----------------------------------|
| `-n STRING`          | the length of STRING is `nonzero` |
| `-z STRING`          | the length of STRING `is zero`    |
| `STRING1 == STRING2` | the strings `are equal`           |
| `STRING1 != STRING2` | the strings `are not equal`       |

`For the full list of booleans`

`Check:  man 1 test`

### Arithmetic expressions

Using the `$((...))` syntax. This is the built-in shell format. The syntax is as follows:

```bash
echo $((x+1))
```

## Command chaining operator

- `;` execute each command sequentially
- `&&` execute each command sequentially
  - If a command fails, the next ones are aborted
- `||` execute each command sequentially
  - If a command succeeds, the next ones are aborted

`Chapter 15: The Bash Shell and Basic Scripting / Constructs`
