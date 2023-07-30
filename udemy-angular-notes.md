AngularJS (Angular 1)

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
- ***string interpolation*** `{{data}}`
  - should return something that can be converted to a string
- ***property biding*** (HTML element properties) `[property]="data"` (one-way biding)
  - change ts code variable value triggers an update on html, but html update doesn't update ts code variable value
## ts code => html
- ***event biding*** `(event)="expression"`
or `(eventName)='myFunc($event)` => for capturing event information
  - React to events 
## html <=> ts code
### Combination of output data and reacting to user events
- ***two-way-biding*** `[(ngModel)]="data"`
  - an update in html triggers an update in ts code and vice-versa (controlled input in React)

---

## Directives are instructions in the DOM

```ts
@Directive({
selector: ['appTurnGreen']
})
export class BetterHighlightDirective implements OnInit {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }
  // USE RENDERER FOR ANY DOM MANIPULATION
  // FOR SIMPLE DOM MANIPULATION, USE HOSTING BIDING
  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'green')
  }
 

}
```

### Reacting to any event, even custom events

```ts
 // USE HOSTLISTENER FOR REACTING TO ANY EVENT
  @HostListener("mouseover", ['$event']) 
  onMouseover(event: MouseEvent) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'blue')
  }
```

### Biding to component properties

```ts
  @HostBiding('style.backgroundColor') backgroundColor: string = 'transparent';

  @HostListener("mouseenter", ['$event']) 
  onMouseover(event: MouseEvent) {
    this.backgroundColor = 'blue'
  }
  
  @HostListener("mouseleave", ['$event']) 
  onMouseover(event: MouseEvent) {
    this.backgroundColor = 'transparent'
  }
```
### listening to enter key keydown event
```ts
@HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // do something
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
  <button  *ngIf="showButton()">Reset username</button>

  - `ngIf` with else branch
  <button  *ngIf="showButton(); else showEmptyMessage">Reset username</button>
  <ng-template #showEmptyMessage >
  <padding>No empty</padding>
  </ng-template>
- `ngFor` for rendering lists

   - `$implicit`: T: The value of the individual items in the iterable (ngForOf).
   - `ngForOf`: NgIterable<T>: The value of the iterable expression. 
     - Useful when the expression is more complex than a property access, for example when using the async pipe (userStreams | async).
   - `index`: number: The index of the current item in the iterable.
   - `count`: number: The length of the iterable.
   - `first`: boolean: True when the item is the first item in the iterable.
   - `last`: boolean: True when the item is the last item in the iterable.
   - `even`: boolean: True when the item has an even index in the iterable.
   - `odd`: boolean: True when the item has an odd index in the iterable.
  
```html
<listItem *ngFor="let item of items; index as i; trackBy: trackByFn">...</listItem>
```
- `ngSwitch` for conditional render
```html
 <ng-container [ngSwitch]="myVal">
  <p *ngSwitchCase="1">val 1</p>
  <ng-container *ngSwitchCase="2">
    <p>val 2</p>
    .
    .
    .
  </ng-container>
  <p *ngSwitchDefault>val default</p>
</ng-container>
```

---

## Attribute directives

### Change the appearance or behavior of an element, component, or another directive

- `ngStyle` => expects an object with styles (remove or adds styles dynamically)
- `ngClass` => expects an object where the keys are the classed and the values are booleans (remove or adds classes
  dynamically)
- For ***biding only one class***, use class biding!
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
  <input type="text" class="form-control" #serverNameInput>
  <span>{{serverNameInput.value}}</span>
  <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">Add Server</button>
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

In the component template, place `<ng-content></ng-content>` marking where you want to add children.

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
- Called before ngOnInit() (*if the component has bound inputs*) and whenever one or more data-bound input properties
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

---

## Services

`ng g s serviceName`

- Create and export the class where you store your logic with the `@Injectable` decorator
- When using it, add it to the providers property of the `@Component` decorator
  - Or you can use the `@Injectable({providedIn: 'root'})` for an app-wide availability, so that you `don't need to add it to the providers array`
- Initialize the class in the component constructor
- Use it as you wish
- `Never manually instantiates a class (new className()) with the new operator`

### Providing values from the service
- Create a getter function on the service class and return a copy of the private service value
- If you return the value itself, any change made on it will reflect the service value

### Hierarchy
- service provided at `AppModule` (`@NgModel`)
  - available app-wide and for other services
  - Shortcut `@Injectable({providedIn: 'root'})`
- service provided at `AppComponent`
  - available to all components, but not for other services
- service provided at a component
  - available to all children of the given component

- If you provide the service to a child, it will overwrite the service of the parent

### ~~Subscribing to service value changes~~ <mark>USE SUBJECT INSTEAD</mark>
- on the service, declare the value as an event emitter
```ts
 selectedRecipe = new EventEmitter<Recipe>()
```
- where the value is generated, emit an event 
```ts
 this.recipeService.selectedRecipe.emit(recipe)
```
- where the value is consumed, subscribe to service value changes
```ts
this.recipeService.selectedRecipe.subscribe( recipe => {
      this.selectedRecipe = recipe
    });
```
---

## Routing

- At `app.module.ts`, create the `appRoutes` with `Routes` type from angular
  - ***no slash for initial routes***
```ts

const appRoutes: Routes = [
  {path: 'first-component', component: 'FirstComponent'},
  {path: 'second-component', component: 'SecondComponent'},      
]

```
- At the imports, add `RouterModule.forRoot(appRoutes)`
- At `app.template.html` add the directive `<router-outlet></router-outlet>`

### Linking

- When clicking on a link, the default behavior is to reload the page with the new html coming from the server
  - It destroys the app state
- Instead, use the `routerLink="/first-component"`
  - Or `routerLink="['/first-component',userName, userId, {details: true}]"` to generate `/first-component/userName/userId;details=true`
- ***use slash for routes***

#### Style active link
- use the `routerLinkActive` property to add a css class when the route defined by `routerLink` is shown
- use the `[routerLinkActiveOptions]` to pass an object for configuring the linking style
  - the component will receive the `routerLinkActive` css class if the url contains the link redirects to
  - add `exact: true` to only use the css class when the route exactly matches the url

### Relative vs Absolute paths

#### Relative paths 
- `Don't use` slashes or use `./`
- If children of a route component, the defined child relative route will be attached to the parent route with `a slash`
- You can also use `../../../` to navigate to a different parent/child route

#### Absolute paths
- Use slashes
- Always refer to the domain, even for children routes

### Programmatically navigation

- declare the `route` variable
```ts
constructor(private router: Router){}
```
- Use the `navigate` method
```ts
onLoad(){
    this.router.naviagte(['/servers'])
}
```
- By default, the `navigate` method does not know the url, so it is relative to the initial route
  - you can change that by specifying the `relativeTo` option
```ts
constructor(private router: Router, private route: ActivatedRoute){}
.
.
.
this.router.navigate(['servers'], {relativeTo: this.route})
```
### Dynamic route

- When declaring a route, use a `:`
```ts
const appRoutes: Routes = [
  {title: 'User', component: UserComponent, path: 'users/:id/:name'},
  {path: 'second-component', component: 'SecondComponent'},
]
```
- At the component, access route information with the `ActivatedRoute`
  - Use `this.route.snapshot` for routes that won't reload providing new data
  - Use `this.route.params` observable for getting the up-to-data route params for cases when the component is reload within itself
```ts
  // if the route reloads with different params, it doesn't run again
  // for getting the up-to-date params, use this.route.params observable
  const params = this.route.snapshot.params; 
  this.user = {id: params['id'], name: params['name']}
```
```ts
    // Always use the up-to-date data
    params.subscribe((newParam)=>{
      this.user = {id: newParam['id'], name: newParam['name']}
    })
```

### Query params

- use `queryParams` directive
- Then, when the link is clicked, it will add the queryParam to the end of the url
```html
<a
  *ngFor="let server of servers"
  class="list-group-item"
  [routerLink]="['/servers',server.id,'edit']"
  [queryParams]="{allowEdit: true}"
>
  {{ server.name }}
</a>
```
or 
```ts
  this.router.navigate(['/servers',user.id,edit], {queryParams: {allowEdit: user.editable}})
```

- To access the query params
```ts
  this.route.snapshot.queryParams
```

### Nested routes

- add the components to be rendered as nested routes in `app.module.ts`
```ts
// normal route
path: 'users/:id'
// the same route, but transformed as nested        
path: ':id'
```
- place ` <router-outlet></router-outlet>` in the parent
  - The components will be rendered here

### Preserving params when navigating programmatically
- two options
  - `merge`
  - `preserve`
```ts
  this.route.navigate(['/users'], {queryParamsHandling: 'preserving'})
```

### Route guarding

- Write a class (normally a service) that implements `CanActivate`
- Then, the function `canActivate` will later guard the route
```ts
type CanActivateReturnUnit = boolean | UrlTree

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit 
```
- Add your route guards to the array `canActivate` from the defined route
```ts
{
  path: 'servers', component: ServersComponent, canActivate: [AuthGuardService], title: 'Servers', children: [
    {path: ':id', component: ServerComponent, title: 'Server',},
    {path: ':id/edit', component: EditServerComponent, title: 'Edit Server'}
  ]
}
```
- Now the route and its children routes will be guarded in the following way:
> If all guards return true, navigation continues. 
> 
> If any guard returns false, navigation is cancelled. 
> 
> If any guard returns a UrlTree, the current navigation is cancelled and a new navigation begins to the UrlTree returned from the guard

### Child route guarding

#### Use in the case when you only want to guard the children routes

- Write a class (normally a service) that implements `CanActivateChild`
- Then, the function `canActivateChild` will later guard the children routes, similarly to `canActivate`
 function
```ts
type CanActivateReturnUnit = boolean | UrlTree

canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit 
```
- Add your route guards to the array `canActivateChild` from the defined route
```ts
{
    path: 'servers', component: ServersComponent, canActivateChild: [AuthGuardService], title: 'Servers', children: [
        {path: ':id', component: ServerComponent, title: 'Server',},
        {path: ':id/edit', component: EditServerComponent, title: 'Edit Server'}
    ]
}
```

### Controlling whether user can leave a route

- Create a service that implements the `CanDeactivate<T>` interface
  - `T` is an interface that has a function that will be executed when the user trys to leave the route
```ts
type CanActivateReturnUnit = boolean | UrlTree

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit;
}

export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }

}
```
- Now add this service to the array `canDeactivate` from the defined route
```ts
 {
  path: ':id/edit',
          component: EditServerComponent,
          title: 'Edit Server',
          canDeactivate: [CanDeactivateGuardService]
}
```
- Make sure that your component implement `T`
- Then create the function defined from `T`
  - This function will be called when the user trys to leave the route
```ts
canDeactivate(): Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit {
  if ((this.server.name !== this.serverName || this.server.status !== this.serverStatus) && !this.changesSaved) {
    return confirm('Do you want to save the changes?')
  }

  return true
}
```

### Passing `static` data to a route

- Pass the static data to the route definition
```ts
{path: 'error', component: PageNotFoundComponent, title: 'Ops', data: {message: 'Page not found'}}
```
- Access the data from the route (`ActivatedRoute`) 
```ts
this.route.snapshot.data.message
```
- You can also subscribe to it if your route will reload from within
```ts
this.route.subscribe((data: Data) => {
    
})
```

### Passing `dynamic` data to a route
#### For example if you want to fetch some data before rendering the route

- Create a service that implements `Resolver<T>`
  - `T` is the type definition of what is going to be resolved
```ts
type temp = { name: string }

export class ServerResolverService implements Resolve<temp> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<temp> | Promise<temp> | temp {
    
  }
}
```
- In the route definition, add the resolve property
```ts
{path: 'error', component: PageNotFoundComponent, title: 'Ops', data: {message: 'Page not found'}, resolve: {server: ServiceResolverService}}
```
 - The dynamic data will be stored on the `resolver`
- Read the data from the route, similarly to what is done with static data

## Observables
### Constructs which you subscribe to be informed about changes in data
### Angular makes use of observables as an interface to handle a variety of common *asynchronous operations*. For example:

- The HTTP module uses observables to handle AJAX requests and responses
- The Router and Forms modules use observables to listen for and respond to user-input events

`Observable` => `Stream` => `Observer`
- Observable emits events (data, error, event completion)

### Remember to always unsubscribe from observables not provided by Angular
```ts
 ngOnInit() {
  this.intervalObservable = interval(1000).subscribe(count => {
    console.log(count)
  })
}

ngOnDestroy(): void {
  this.intervalObservable.unsubscribe()
}
```

### Custom observer

```ts
ngOnInit() {
  const customIntervalObserver = new Observable((observer: Subscriber<number>) => {
    // Subscriber<T> define the type of the emitted data
    let count = 0;
    setInterval(() => {
      if (count > 3) {
      // declare error
        observer.error(new Error('Big number'))
      }
      if (count > 2) {
      // declare completion
        observer.complete()
      }
      // emit data
      observer.next(count)
      count++;
    }, 1000)
  })

  this.intervalObservableSubscription = customIntervalObserver.subscribe((data) => {
    // function that deals with data
    console.log(data)
  }, (error) => {
    // function that deals with error
    // when the observable emits an error, the observable is destroyed, no need to unsubscribe
    console.error(error)
  }, () => {
    // function that deals with observable completion
    // no arguments
    // Observable stops
    // if the observable emits an error, the function that handles completion is not called
    console.warn('observable completed')
  })

}
```

### Transforming observable data with `pipe`

```ts
const transformedIntervalObserver =  customIntervalObserver.pipe(map(data => {
  return `Count: ${data}`
}));
```

## Subjects 

A subject is an observer

Use subjects instead of event emitter for cross component communication
 - For example when you need to call next from outside the observable
 - <mark>When you manually call</mark> `emit` without `@Output`
 - Remember to unsubscribe from it

```ts
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {
    activatedEmitter = new Subject<boolean>();
}
```
```ts
...
constructor(private userService: UserService) {}
...
onActivate() {
    this.userService.activatedEmitter.next(value)
}
```
```ts
constructor(private userService: UserService) {}
...
ngOnInit() {
    this.eventSub = this.userService.activatedEmitter.subscribe(data => {
        
    })
}
...
ngOnDestroy() {
    this.eventSub.unsubscribe()
}
```

---

## Angular Forms

## Simple, Template-driven (TD) 

- On the form tag, add
```html
<form (ngSubmit)="onSubmit(form)" #form="ngForm">
```
  - When the form is submitted, all the inputs will produce an object where the keys are the name property and the values are the input values
```ts
  onSubmit(form: NgForm) {
  console.log(form) // form.value has the values of the inputs
}
```

### Accessing the form reference inside ts code

Use the `@ViewChild` reference builder with the `ngForm` type

### Form inputs register control

Add `ngModel` on the inputs/select elements you want to access

### Validation

Works jointly with the validators:

```ts
  static min(min: number): ValidatorFn
  static max(max: number): ValidatorFn
  static required(control: AbstractControl<any, any>): ValidationErrors | null
  static requiredTrue(control: AbstractControl<any, any>): ValidationErrors | null
  static email(control: AbstractControl<any, any>): ValidationErrors | null
  static minLength(minLength: number): ValidatorFn
  static maxLength(maxLength: number): ValidatorFn
  static pattern(pattern: string | RegExp): ValidatorFn
  static nullValidator(control: AbstractControl<any, any>): ValidationErrors | null
  static compose(validators: ValidatorFn[]): ValidatorFn | null
  static composeAsync(validators: AsyncValidatorFn[]): AsyncValidatorFn | null
```

Take advantage of the following dynamically applied css classes: 

- ng-valid
- ng-invalid
- ng-pending
- ng-pristine
- ng-dirty
- ng-untouched
- ng-touched
- ng-submitted (enclosing form element only)

### Using references to controlled inputs

- Set a reference to `ngModel`
- Use the reference and its properties

```html
<input type="email" id="email" class="form-control" ngModel name="userEmail" email required #email='ngModel'>
<span class="help-block" *ngIf="email.invalid && email.touched">Please enter a valid email</span>
```

### Setting form control default values

Use `[ngModel]='string'`

```html
<select [ngModel]="'pet'" id="secret" class="form-control" name="secreteQuestion" required>
```

### Types of biding with `ngModel`

- No biding => just tells Angular it's a form control, giving access to its value in the submitted object
- One-way-biding => Above and for setting a default value
- Two-way-biding => no biding plus reacting to any value change immediately

### Grouping form controls

- Use `ngModelGroup='identifier'`
- Now all the controls inside it will have their values grouped

### Accessing form control group information
- Create a reference to the ngModelGroup
```html
  #referenceIdentifier='ngModelGroup'
```
- It creates states for the whole group, like `invalid`, `touched`, .etc.
- Access the group information on the HTML code as `referenceIdentifier`

### Setting control values with `setValue` and `patchValue`

- Form reference `(form: NgForm)=>` `setValue`
  - For all controls
- Form property from the form reference `(form: NgForm).form` => `patchValue`
  - For a specific control

### Resetting controls

- Use the `reset` method of the form reference
- Use the `setValue` and reset all the controls

## Reactive forms

- Import the `ReactiveFormsModule`
- Assign your form to a formGroup directive as well as the controls
```ts
signUpForm: FormGroup;

ngOnInit() {
  this.signUpForm = new FormGroup<any>({
    'username': new FormControl(null),
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'gender': new FormControl('male')
  })
}
```
- Connect the form and the form controls
  - form => directive `[formGroup]`
  - form controls => `formControlName`
```html
 <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="username">Username</label>
    <input
            type="text"
            id="username"
            formControlName="username"
            class="form-control">
  </div>
  <div class="form-group">
    <label for="email">email</label>
    <input
            type="text"
            id="email"
            formControlName="email"
            class="form-control">
  </div>
  <div class="radio" *ngFor="let gender of genders">
    <label>
      <input
              type="radio"
              formControlName="gender"
              [value]="gender">{{ gender }}
    </label>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```
- Access the form information as the TD approach
```ts
 onSubmit() {
    console.log(this.signUpForm)
  }
```

### Getting access to controls on the template

Use the `get` method

```html
<input
        type="text"
        id="username"
        formControlName="username"
        class="form-control">
<span *ngIf="signUpForm.get('username').invalid && signUpForm.get('username').touched"
      class="help-block">Enter a valid username</span>
```

### Form group

- Nest you form group on the file using `formGroup`
```ts
this.signUpForm = new FormGroup({
  'userdata': new FormGroup<{email: FormControl<string | null>, username: FormControl<string | null>}>({
    'username': new FormControl<string>(null, [Validators.required]),
    'email': new FormControl<string>(null, [Validators.required, Validators.email]),
  }),
  'gender': new FormControl<string>('male')
})
```
- Nest your template using the `formGroupName`
```html
<ng-container formGroupName="userdata">
  <div class="form-group">
    <label for="username">Username</label>
    <input
            type="text"
            id="username"
            formControlName="username"
            class="form-control">
    <span *ngIf="signUpForm.get('userdata.username').invalid && signUpForm.get('userdata.username').touched"
          class="help-block">Enter a valid username</span>
  </div>
  <div class="form-group">
    <label for="email">email</label>
    <input
            type="text"
            id="email"
            formControlName="email"
            class="form-control">
    <span *ngIf="signUpForm.get('userdata.email').invalid && signUpForm.get('userdata.email').touched"
          class="help-block">Enter a valid email</span>
  </div>
</ng-container>
```
- When you want to access a nested form control, use the path separated by a dot
```html
 <span *ngIf="signUpForm.get('userdata.username').invalid && signUpForm.get('userdata.username').touched"
          class="help-block">Enter a valid username</span>
```

### Dynamic form controls (`FormArray`)