# AngularJS

Angular 2 (2016) ... => Angular

- New version every 6 months, backward, incremental, compatible changes

Component => styling, template, logic

`n g c <component-name> => shortcut to generate a new component`

`n g d <directive-name> => shortcut to generate a new directive`

---

## template property of the object passed to decorator @Component

- use it to write html code inside typescript code (logic), try to avoid it
- use backticks to write a multiline template

  - inline template

  ```js

  @Component({
   selector: 'server-component',
   template: `<server-component></server-component`
  })
  ```

---

## similarly to template property, you can declare inline styles with the styles property from @Component decorator

- use backticks to write a multiline style css declarations

```ts
 @Component({
    selector: 'server-component',
    template: `<server-component></server-component`,
    styles: [`
              h3 {
                  color: pink;
              }
     `]
})
```

---

## possible ways to use the selector property of the object passed to @Component decorator

- selector: '[app-servers]' => <div app-servers ></div>
- selector: '.app-servers' => <div class='app-servers'></div>
- selector: 'server-component' => <server-component></server-component>

---

## Data biding => communication between ts code (logic) and html (template)

---

## OutputData

- **_string interpolation_** `{{data}}`
  - should return something that can be converted to a string
- **_property biding_** (HTML element properties) `[property]="data"` (one-way biding)
  - change ts code variable value triggers an update on html, but html update doesn't update ts code variable value

## ts code => html

- **_event biding_** `(event)="expression"`
  or `(eventName)='myFunc($event)` => for capturing event information
  - React to events

## html => ts code

### Combination of output data and reacting to user events

- **_two-way-biding_** `[(ngModel)]="data"`
  - an update in html triggers an update in ts code and vice-versa (controlled input in React)

---

## Directives are instructions in the DOM

```ts
@Directive({
 selector: ['appTurnGreen'],
})
export class BetterHighlightDirective implements OnInit {
 constructor(private renderer: Renderer2, private elementRef: ElementRef) {}
 // USE RENDERER FOR ANY DOM MANIPULATION
 ngOnInit(): void {
  this.renderer.setStyle(
   this.elementRef.nativeElement,
   'background-color',
   'green'
  );
 }
}
```

### Reacting to any event, even custom events

```ts
 // USE HOSTLISTENER FOR REACTING TO ANY EVENT
  @HostListener("mouseover") mouseover(event: MouseEvent) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'blue')
  }
```

### Biding to component properties

```ts
  @HostBiding('style.backgroundColor') backgroundColor: string = 'transparent';

  @HostListener("mouseenter") mouseover(event: MouseEvent) {
    this.backgroundColor = 'blue'
  }
  @HostListener("mouseleave") mouseover(event: MouseEvent) {
    this.backgroundColor = 'transparent'
  }
```

```html
<p appTurnGreen>Receive a green background</p>
```

## You can use directives without square brackets, but pay attention that it's not a normal property

- By doing this, you don't need to use `"'value'"` when passing in directives

---

## Structural directives

### Responsible for HTML layout, they shape or reshape the DOM's structure, typically by adding, removing, and manipulating the host elements to which they are attached

#### They have a leading `*` when being used

- `ngIf` => conditionally render the component
  <button \*ngIf="showButton()">Reset username</button>

- `ngIf` with else branch
  <button \*ngIf="showButton(); else showEmptyMessage">Reset username</button>
  <ng-template #showEmptyMessage >
  <p>No empty</p>
  </ng-template>
- `ngFor` for rendering lists

---

## Attribute directives

### Change the appearance or behavior of an element, component, or another directive

- `ngStyle` => expects an object with styles (remove or adds styles dynamically)
- `ngClass` => expects an object where the keys are the classed and the values are booleans (remove or adds classes
  dynamically)
- For **_biding only one class_**, use class biding!
  `[class.ClassNaMe]='booleanExpression'`
- `ngModel` => Adds two-way data binding to an HTML form element.

---

## Passing data (bound input properties [props]) to a component & getting data from a component (events)

- @Input('optionalBidingPropertyName') classField
  Pass data down to a child component

- @Output + new EventEmitter<T>();
  Trigger event to pass data up to the parent component

### View encapsulation (CSS styles encapsulation policies)

Each component is a view, in the sense that it is separated from other components
E.g.: the styles that a component has is scoped to this component (not applied to any other component)

#### You can change this default behavior (ViewEncapsulation.Emulated) (encapsulation property of the object passed to

@Component decorator)

- encapsulation: ViewEncapsulation.None (don't encapsulate, e.g: apply the styles everywhere)
- encapsulation: ViewEncapsulation.ShadowDom
  the same as ViewEncapsulation.Emulated, but encapsulate only where browsers accept it

---

## Element reference (local reference)

- Only available inside html, but you can pass data via events to the ts code

  ```html
  <input type="text" class="form-control" #serverNameInput />
  <span>{{serverNameInput.value}}</span>
  <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">
   Add Server
  </button>
  ```

- Doing the same thing from ts code side, do the following:

  ```ts
  @ViewChild('serverNameInput') serverContentInput: ElementRef<HTMLInputElement>;
  //Use it as your last resort!
  ```

  - In case you want to access it inside ngOnInit(), use `{static: true}`

  ```ts
  @ViewChild('serverNameInput', {static: true}) serverContentInput: ElementRef<HTMLInputElement>;
  ```

---

## Render children inside component

In the component template, place `<ng-content></ng-content>` marking where you want to add children
While using the component, just pass in the children inside the component

```html
<app-server-element>
 <p #paragraphElement>hello</p>
</app-server-element>
```

- For accessing an element (via ref) which is passed as content (`children`), use `@ContentChild`

```ts
 @ContentChild('paragraphElement', {static: true}) paragraph: ElementRef<HTMLParagraphElement>
```

---

## Component lifecycle

### `ngOnChanges()`

#### Respond when Angular sets or resets data-bound input properties

- Called before ngOnInit() (_if the component has bound inputs_) and whenever one or more data-bound input properties
  change
- If your component has no inputs, or you use it without providing any inputs, the framework will not call ngOnChanges()
- The method receives a `SimpleChanges` object of current and previous property values

### `ngOnInit()`

#### Initialize the directive or component after Angular first displays the data-bound properties (here data-bound properties are ready to use) and sets the directive or component's input properties

- Called once, after the first ngOnChanges(). ngOnInit() is still called even when ngOnChanges() is not (which is the case when there are no template-bound inputs).
- Runs after the constructor
- References may not be available, because it has not been rendered yet

### `ngOnDoCheck()`

#### Detect and act upon changes that Angular can't or won't detect on its own

- Run immediately after ngOnInit() on the first run, then called immediately after ngOnChanges() on every change detection run.

### `ngAfterContentInit()`

#### Respond after Angular projects external content `children` into the component's view, or into the view that a directive is in

- Called **once** after the first ngDoCheck()

### `ngAfterContentChecked()`

#### Respond after Angular checks the content projected `children` into the directive or component

- Called after ngAfterContentInit() and every subsequent ngDoCheck()

### `ngAfterViewInit()`

#### Respond after Angular initializes the component's views and child views, or the view that contains the directive

- Called once after the first ngAfterContentChecked()
- References are available

### `ngAfterViewChecked()`

#### Respond after Angular checks the component's views and child views, or the view that contains the directive

- Called after the ngAfterViewInit() and every subsequent ngAfterContentChecked()

### `ngOnDestroy()`

#### Cleanup just before Angular destroys the directive or component. Unsubscribe Observables and detach event handlers to avoid memory leaks

- Called immediately before Angular destroys the directive or component
