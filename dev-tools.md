# DevTools notes

## Panel and pane

- CTRL+SHIFT+C  (C for CSS)
  - Opens the Elements panel in inspector mode
- CTRL+SHIFT+J  (J for JS)
  - Opens the Console panel
- CTRL+SHIFT+I  (I for ?,choice)
  - Opens last panel

Use the command menu for faster actions
delete > to see all options

## General overview

To remind you that JavaScript is disabled, Chrome shows the corresponding Disabled JavaScript icon (<>red x) in the address bar and DevTools shows a warning yellow icon next to Sources

Device Mode is the name for a collection of features in Chrome DevTools that help you simulate mobile devices

When in doubt, your best bet is to actually run your page on a mobile device. Use Remote Debugging to view, change, debug, and profile a page's code from your laptop or desktop while it actually runs on a mobile device

## Source panel

For JavaScript changes to take effect, press Control+S (Windows, Linux). DevTools doesn't re-run a script, so the only JavaScript changes that take effect are those that you make inside of functions. So make something to rerun that function, so you can see the effect of your saved changes, like on a click event

For CSS if you edit a property of an element, you'll see that the change takes effect immediately

***DevTools erases your CSS and JavaScript changes when you reload the page***

By default, when you edit a file in the Sources panel, those changes are lost when you reload the page. Workspaces enable you to save the changes that you make in DevTools to your file system

Note: If you paused on a different line, you have a browser extension that registers a click event listener on every page that you visit. You were paused in the extension's click listener. If you use Incognito Mode to browse in private, which disables all extensions, you can see that you pause on the correct line of code every time.

### Event Listener Breakpoints

It's worth memorizing all the different types, because each type ultimately helps you debug different scenarios as quickly as possible

### Breakpoints

- F8 - Go to next breakpoint
- F9 - ?
- F10 - execute the function without stepping into it
- F11 - go inside the function
- F11 + SHIFT - Leave current function call

#### Run all code up to a certain line

You could step through all the lines, but that can be tedious. You could set a line-of-code breakpoint on the line you're interested in and then press Resume Script Execution Resume script execution, but there's a faster way.

Right-click the line of code that you're interested in, and select `Continue to here`. DevTools runs all of the code up to that point, and then pauses on that line.

#### Force script execution

To ignore all breakpoints and force your script to resume execution, `click and hold Resume Script Execution and then select Force script execution`

#### Ignore a script or pattern of scripts

`Very useful thing!`

Ignore a script to skip it while debugging

When ignored, a script is obscured in the Call Stack pane, and you never step into the script's functions when you step through your code.

- In Sources > Page, right-click a directory or a script file.
- Select Add directory/script to ignore list.

#### Minified file readable

By default, the Sources panel pretty-prints minified files. When pretty-printed, the Editor may show a single long code line in multiple lines, with `-` to indicate that it's the line continuation.

---

On the scope pane, double-click a variable value to edit it

On the watch tab, you monitor the values of variables over time. As the name implies, Watch Expressions aren't just limited to variables. You can store any valid JavaScript expression in a Watch Expression

- Line-of-code
  - pause when you know the exact region of code that you need to investigate
  - DevTools always ***pauses before*** this line of code is executed
  - set a line-of-code breakpoint in DevTools or use `debugger` on the code
- Conditional line-of-code
  - when you want to stop the execution but only when some condition is true
  - Such breakpoints are useful when you want to skip breaks that are irrelevant to your case, for example in a loop
  - On devTools, right-click on the line number
- Logpoint
  - Use log line-of-code breakpoints (logpoints) to log messages to the Console `without pausing the execution and without cluttering up your code with console.log() calls`
  - You can use the same syntax as you would with a console.log(message) call
- DOM
  - when you want to pause on the code that changes a DOM node or its children

#### Types of DOM change breakpoints

- Subtree modifications.
  - Triggered when a child of the currently-selected node is removed or added, or the contents of a child are changed. Not triggered on child node attribute changes, or on any changes to the currently-selected node.
- Attributes modifications
  - Triggered when an attribute is added or removed on the currently-selected node, or when an attribute value changes.
- Node Removal
  - Triggered when the currently-selected node is removed.
  
#### How to add DOM breakpoints

1. Click the Elements tab.
2. Go to the element that you want to set the breakpoint on.
3. Right-click the element.
4. Hover over Break on then select:
   1. Subtree modifications
   2. Attribute modifications
   3. Node removal

#### XHR/fetch breakpoints

Use an XHR/fetch breakpoint when you want to break when the request URL of an XHR contains a specified string. DevTools pauses on the line of code where the XHR calls send().

One example of when this is helpful is when you see that `your page is requesting an incorrect URL`, and you want to quickly find the AJAX or Fetch source code that is causing the incorrect request.

#### To set an XHR/fetch breakpoint

1. Click the Sources tab.
1. Expand the XHR Breakpoints pane.
1. Click Add. Add breakpoint.
1. Enter the string which you want to break on. DevTools pauses when this string is present anywhere in an XHR's request URL.
1. Press Enter to confirm.

#### Exception breakpoints

Use exception breakpoints when you want to pause on the line of code that's throwing a caught or uncaught exception. You can pause on both such exceptions independently in any debug session other than Node.js.

`Currently, in a Node.js debug session, you can pause on caught exceptions only if you also pause on uncaught ones`

|Breakpoint type | Use this when you want to ...|
|-|-|
|Line-of-code | pause when you know the exact region of code that you need to investigate|
|Conditional line-of-code | Pause on an exact region of code, but only when some other condition is true.
|Logpoint | Log a message to the Console without pausing the execution.|
|DOM | Pause on the code that changes or removes a specific DOM node, or its children.|
|XHR | Pause when an XHR URL contains a string pattern.|
|Event listener | Pause on the code that runs after an event, such as click, is |fired.
|Exception | Pause on the line of code that is throwing a caught or uncaught |exception.
|Function | Pause whenever a specific function is called|
|Trusted | Type Pause on Trusted Type violations|

### Workspace

Workspace lets you `save a change that you make in DevTools to a local copy of the same file on your computer`

If there is a green dot next to the file name, it means that DevTools has established a mapping between the network resources of the page, and the file

### Local Overrides

Local overrides is another DevTools feature that is similar to workspace. Use local overrides when you want to experiment with changes to a page, and you need to `see those changes across page loads, but you don't care about mapping your changes to the page's source code`

With local overrides, you can override HTTP response headers and web content, including XHR and fetch requests, to mock remote resources even if you don't have access to them

This lets you prototype changes without waiting for the backend to support them

How it works:

- When you make changes in DevTools, DevTools saves a copy of the modified file to a folder you specify.
  - If you want to save it to a source file, use workspace
- When you reload the page, DevTools serves the local, modified file, rather than the network resource.

## Element panel

- use `.cls` more often. It makes working with classes faster
- use `.hov` to see and work with pseudoclasses more often
- crossed out properties are overwritten properties
- grayed out selectors are selectors that do not match the viewed element
- `user agent stylesheet` are the Chrome default stylesheets
  - they are not editable
- Use the filter more often both on the style pane and on the computed tab to focus on the property you want
- On the `inherited from section`,  grayed out properties are properties that are present on the parent but not inherited by default, hence not applied as log as they are inherited
- Click on the color circle on the right of the color picker to copy the color to your clipboard
- Contrast ratio is only available for `color` property value
- Shift-click the preview icon next a color property value to change its color space
- For building an unknown layout with grid or flexbox, use display property, then click on the layout editor (badge next to the element on the dom tree) to see the effect of other properties, without writing any css yourself
  - Additionally, use the `Layout` pane for additional information
- Increment enumerable values
  - Alt+Up to increment by `0.1`
  - Shift+Up to increment by `10`
  - Control+Shift+Page Up to increment the value by `100`
  - `Decrementing also works`. Just replace each instance of Up mentioned above with Down.
  - When dragging to change a property's value, to adjust the value by 10, hold Shift when dragging
- Copy CSS changes
  - To enable this experimental feature, check Sync CSS changes in the Styles pane under Settings. Settings > Experiments and reload DevTools.
  - Additionally, you can track changes you make with the `Changes tab`

### Computed pane

- Runtime
  - The Computed pane lists property values calculated at runtime in pale text (grayed out)

## Console panel

