# Angular notes

AngularJS (Angular 1)

Angular 2 (2016) ... => Angular

- New version every 6 months, backward, incremental, compatible changes

## Possible ways to use the selector property of the object passed to @Component decorator

- selector: '[app-servers]'
  
```html
<div app-servers ></div>
```

- selector: '.app-servers'
  
```html
<div class='app-servers'></div>
```

- selector: 'server-component'

```html
<server-component></server-component>
```

## OutputData

- ***string interpolation*** `{{data}}`
  - should return something that can be converted to a string
- ***property biding*** (HTML element properties) `[property]="expression"` (one-way biding)
  - change ts code variable value triggers an update on html, but html update doesn't update ts code variable value
- ***attribute biding*** (HTML element attributes) `[attr.attribute-you-are-targeting]="expression"`
  - Here, `attr.` is constant
  
```html
[attr.aria-label]="actionName"
```
  
## html => ts code

- ***event biding*** `(event)="expression"`
or `(eventName)='myFunc($event)` => for capturing event information
  - React to events
  - For keyboard events, ALWAYS check <https://angular.io/guide/event-binding#binding-to-keyboard-events>
  
## html <=> ts code

### Combination of output data and reacting to user events

- ***two-way-biding*** `[(property)]="expression"`
  - an update in html triggers an update in ts code and vice-versa
  - use the pattern `property` for @Input and `propertyChange` for @Output
  - Whenever you update the property, emit an event with this updated value
  - Then Angular will set the emitted value to the `property`
  - See <https://angular.io/guide/two-way-binding> for more info

## Directives

Directives are classes that add additional behavior to elements in your Angular applications

3 types

- Attribute
  - Change the appearance or behavior of an element, component, or another directive.
- Structural
  - Change the DOM layout by adding and removing DOM elements.
- Components

A directive can provide insight into a DOM object that you cannot change directly.

You can't access the implementation of a built-in `<div>`, or modify a third party component.

`You do have the option to watch these elements with a directive`

`You can extend a component with a directive (extends DirectiveName) or use it directly on a component selector markup as a property ([directiveSelector])`

```ts
@Directive({
selector: '[appTurnGreen]'
})
export class BetterHighlightDirective implements OnInit {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }
  // USE RENDERER FOR ANY DOM MANIPULATION
  // FOR SIMPLE DOM MANIPULATION, USE HOSTING BIDING

  // ElementRef grants direct access to the host DOM element through its nativeElement property
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
  @HostBiding('style.backgroundColor') 
  backgroundColor: string = 'transparent';

  @HostListener("mouseenter", ['$event']) 
  onMouseover(event: MouseEvent) {
    this.backgroundColor = 'blue'
  }
  
  @HostListener("mouseleave", ['$event']) 
  onMouseover(event: MouseEvent) {
    this.backgroundColor = 'transparent'
  }
```

### listening to enter-key keydown event

```ts
@HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // do something
  }
```

```html
<p appTurnGreen>Receive a green background</p>
```

### Passing value to directives

- Add an appHighlight `@Input()` property
- When using the directive, pass in a value as if it were a property

```ts
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @Input() defaultColor = '';

  @Input() appHighlight = '';

  @HostListener('mouseenter') 
  onMouseEnter() {
    this.highlight(this.appHighlight || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') 
  onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

```html
<p [appHighlight]="color" defaultColor="violet"></p>
```

## Structural directives

### Responsible for HTML layout, they shape or reshape the DOM's structure, typically by adding, removing, and manipulating the host elements to which they are attached

#### They have a leading `*` when being used

- `ngIf` => conditionally render the component
  <button  *ngIf="showButton()">Reset username</button>

  - `ngIf` with else branch
  
```html
  <button  *ngIf="showButton; else showEmptyMessage">Reset username</button>
  <ng-template #showEmptyMessage >
  <padding>No empty</padding>
  </ng-template>
```

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

### Creating structural directives

```ts
@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

```html
<p *appUnless="condition">Show this sentence unless the condition is true.</p>
```

## Attribute directives

### Change the appearance or behavior of an element, component, or another directive

- `ngStyle` => expects an object with styles (remove or adds styles dynamically)
- `ngClass` => expects an object where the keys are the classed and the values are booleans (remove or adds classes
  dynamically)
- For ***biding only one class***, use class biding!
  `[class.ClassNaMe]='booleanExpression'`
- `ngModel` => Adds two-way data binding to an HTML form element.

## Passing data (bound input properties [props]) to a component & getting data from a component (events)

- @Input('aliasBidingPropertyName') classField;
  - Pass data down to a child component

- @Output() event = new EventEmitter<T>();
  - Trigger event to pass data up to the parent component

### View encapsulation (CSS styles encapsulation policies)

Each component is a view, in the sense that it is separated from other components
E.g.: the styles that a component has is scoped to this component (not applied to any other component)

#### You can change this default behavior (ViewEncapsulation.Emulated) (encapsulation property of the object passed to @Component decorator)

- encapsulation: ViewEncapsulation.None (don't encapsulate, e.g: apply the styles everywhere)
- encapsulation: ViewEncapsulation.ShadowDom
  the same as ViewEncapsulation.Emulated, but encapsulate only where browsers accept it

## Element reference (local reference)

- Only available inside html, but you can pass data via events to the ts code
  - You can access all component properties and methods
  
    ```html
    <input type="text" class="form-control" #serverNameInput>
    <span>{{serverNameInput.value}}</span>
    <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">Add Server</button>
    <on-changes [hero]="hero" [power]="power"></on-changes>
    ```

- Doing the same thing from ts code side, do the following:
- `BUT REMEMBER, THE REFERENCE IS AVAILABLE ONLY IN/AFTER ngAfterViewInit()`
  
  ```ts
  @ViewChild('serverNameInput') 
  serverContentInput: ElementRef<HTMLInputElement>;
  ```

  - In case you want to access it inside ngOnInit(), use `{static: true}`
  
  ```ts
  @ViewChild('serverNameInput', {static: true}) 
  serverContentInput: ElementRef<HTMLInputElement>;
  ```

  - `You can pass a reference from html, like 'serverNameInput', or a reference to a component used on the view`
  - Prevent error like the following, by wrapping a peace of logic inside a `setTimeout` with a tick of `0`
  - Reference: <https://angular.io/guide/component-interaction#parent-calls-an-viewchild>

```ts
NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked
```
  
```ts
    @ViewChild(OnChangesComponent) 
    childView!: OnChangesComponent;
```

## Render children inside component

In the component template, place `<ng-content></ng-content>` marking where you want to add children.

### Single-slot projection

While using the component, just pass in the children inside the component

```html
<app-server-element>
    <p #paragraphElement>hello</p>
</app-server-element>
```

### Multi-slot projection

A component can have multiple slots. Each slot can specify a CSS selector that determines which content goes into that slot

- Add a select attribute to the `<ng-content>` elements. Angular supports selectors for any combination of tag name, attribute, directive, CSS class, and the :not pseudo-class
  
```html
<h2>Multi-slot content projection</h2>

Default:
  <ng-content></ng-content>

Question:
  <ng-content select="[question]"></ng-content>
```

```html
<app-zippy-multislot>
  <p question>
    Is content projection cool?
  </p>
  <p>Let's learn about content projection!</p>
</app-zippy-multislot>
```

### Conditional content projection

Check `ngTemplateOutlet` at <https://angular.io/guide/content-projection#conditional-content-projection>

If your component needs to conditionally render content, or render content multiple times, you should configure that component to accept an `<ng-template>` element that contains the content you want to conditionally render

If your component includes an `<ng-content>` element without a select attribute, that instance receives all projected components that do not match any of the other `<ng-content>` elements

Using an `<ng-content>` element in these cases is not recommended, because when the consumer of a component supplies the content, that content is always initialized, even if the component does not define an `<ng-content>` element or if that `<ng-content>` element is inside of an `ngIf` statement

`With an <ng-template> element, you can have your component explicitly render content based on any condition you want, as many times as you want. Angular will not initialize the content of an <ng-template> element until that element is explicitly rendered`

### Access the ref

- For accessing an element (via ref) which is passed as content (`children`), use `@ContentChild`
- `BUT REMEMBER, THE REFERENCE IS AVAILABLE ONLY IN/AFTER ngAfterContentInit()`
  
```ts
 @ContentChild('paragraphElement', {static: true}) 
 paragraph: ElementRef<HTMLParagraphElement>
```

## Component lifecycle

After your application instantiates a component or directive by calling its constructor, Angular calls the hook methods you have implemented at the appropriate point in the lifecycle of that instance in the following sequence

### `ngOnChanges()`

#### Respond when Angular sets or resets data-bound input properties

- Called before ngOnInit() (*if the component has bound inputs*) and whenever one or more data-bound input properties
  change
- If your component has no inputs, or you use it without providing any inputs, the framework will not call ngOnChanges()
- The method receives a `SimpleChanges` object of current and previous property values
- `This happens frequently, so any operation you perform here impacts performance significantly`
- Be careful while using objects as data-biding inputs. The change is assigned to the object reference, not the object value(s). So if only a property from the object changes, `ngOnChanges` will not fire, because the object reference did not change

### `ngOnInit()`

#### Initialize the directive or component after Angular first displays the data-bound properties (here data-bound properties are ready to use) and sets the directive or component's input properties

- Called once, after the first ngOnChanges(). ngOnInit() is still called even when ngOnChanges() is not (which is the case when there are no template-bound inputs).
- References may not be available, because the component's view has not been rendered yet

### `ngOnDoCheck()`

#### Detect and act upon changes that Angular can't or won't detect on its own

- Run immediately after ngOnInit() on the first run, then called immediately after ngOnChanges() on every change detection run anywhere on the page.
- `Beware! Called frequently!`

### `ngAfterContentInit()`

#### Respond after Angular projects external content `children, <ng-content></ng-content>` projected into the component's view, or into the view that a directive is in

- Called **once** after the first ngDoCheck()

### `ngAfterContentChecked()`

#### Respond after Angular checks the content `children, <ng-content></ng-content>` projected  into the component's view, or into the view that a directive is in

- Called after ngAfterContentInit() and every subsequent ngDoCheck()
- `Beware! Called frequently!`

### `ngAfterViewInit()`

#### Respond after Angular initializes the component's views and child views `(components or HTML elements used inside component's view)`, or the view that contains the directive

- Called once after the first ngAfterContentChecked()
- `References are available`

### `ngAfterViewChecked()`

#### Respond after Angular checks the component's views and child views `(components or HTML elements used inside component's view)`, or the view that contains the directive

- Called after the ngAfterViewInit() and every subsequent ngAfterContentChecked()
- `Beware! Called frequently!`

### `ngOnDestroy()`

#### Cleanup just before Angular destroys the directive or component. Unsubscribe Observables and detach event handlers to avoid memory leaks

- Called immediately `before` Angular destroys the directive or component

#### DestroyRef

In addition to ngOnDestroy(), you can inject Angular's DestroyRef and register callback functions to be called when the enclosing context is destroyed. This can be useful for building reusable utilities that require cleanup.

If DestroyRef is injected in a component or directive, the callbacks run when that component or directive is destroyed. Otherwise the callbacks run when a corresponding injector is destroyed

## Services

`ng g s serviceName`

- Create and export the class where you store your logic with the `@Injectable` decorator
- When using it, add it to the providers property of the `@Component` decorator
  - Or you can use the `@Injectable({providedIn: 'root'})` for an app-wide availability, so that you `don't need to add it to the providers array`
- Initialize the class in the component constructor
- Use it as you wish

### Providing values from the service

- Create a getter function on the service class and return a copy of the private service value
- If you return the value itself, any change made on it will reflect the service value

## Hierarchy

- service provided at `AppModule` (`@NgModel`)
  - available app-wide and for other services
  - Shortcut `@Injectable({providedIn: 'root'})`
- service provided at `AppComponent`
  - available to all components, but not for other services
- service provided at a component
  - available to all children of the given component

- If you provide the service to a child, it will overwrite the service of the parent

## Types of injectors

- `NullInjector()`
  - Top of the tree
  - Returns error unless `@Optional() is used`
- `EnvironmentInjector`
- `ElementInjector()`
  - Angular creates ElementInjector hierarchies implicitly for each DOM element.


When the component instance is destroyed, so is that service instance

When you configure a provider for a component or directive using the providers property, that provider belongs to the ElementInjector of that component or directive. 

Components and directives on the same element share an injector.

## Resolution rules

When a component declares a dependency, Angular tries to satisfy that dependency with its own `ElementInjector`. 

If the component's injector lacks the provider, it passes the request up to its parent component's `ElementInjector`

If Angular doesn't find the provider in any `ElementInjector hierarchies, it goes back to the element where the request originated and looks in the EnvironmentInjector` hierarchy, starting from `ModuleInjector` (the service itself). 

If Angular still doesn't find the provider, it throws an error `unless @Optional is provided`

## Resolution modifiers

@Optional(), @Self(), @SkipSelf() and @Host()

Resolution modifiers fall into three categories:

- What to do if Angular doesn't find what you're looking for, that is `@Optional()`
- Where to `start looking`, that is `@SkipSelf()`
- Where to `stop looking`, `@Host()` and `@Self()`

### `@Self()`

Use `@Self()` so that Angular will only look at the `ElementInjector` (host) for the current component or directive

### `@SkipSelf()`

`@SkipSelf()` is the opposite of `@Self()`. With `@SkipSelf()`, Angular starts its search for a service in `the parent ElementInjector`, rather than in the current one

### `@Host()`

`@Host()` lets you designate a component as the last stop in the injector tree when searching for providers.

It doesn't even go to `ModuleInjector`

## ~~Subscribing to service value changes~~ <mark>USE SUBJECT INSTEAD</mark>

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

### New way

- Add the following to the providers array:

```ts
provideRouter(routes, withComponentInputBinding())
```

- `withComponentInputBinding()` makes it possible to bind inputs to any route data: static or resolved route data, path parameters, matrix parameters, and query parameters
  - `If you want to use the parent components route info you will need to set the router paramsInheritanceStrategy option: withRouterConfig({paramsInheritanceStrategy: 'always'})`

### Route path wildcards

- `**` represents any route
  - use it as the last route, because Angular uses a first-match wins strategy when matching routes
  - Normally used for `Page not fould` component
- `''`
  - Normally, you would use ti with a redirectTo property

### Linking

- When clicking on a link, the default behavior is to reload the page with the new html coming from the server
  - It destroys the app state
- Instead, use the `routerLink="/first-component"`
  - Or `routerLink="['/first-component',userName, userId, {details: true}]"` to generate: <br> `/first-component/userName/userId;details=true`
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

### Setting static/dynamic page title

Each page in your application should have a unique title so that they can be identified in the browser history

#### Static

- For static, just set it in the route definition by using the title property

#### Dynamic

- Use the `ReseolveFn<T>` function
- Pass this function to the title property in the route definition

```ts
{
  path: 'child-a',  // child route path
  title: resolvedChildATitle,
  component: ChildAComponent,  // child route component that the router renders
}
.
.
.
// defined somewhere in your application, or even inside a service
const resolvedChildATitle: ResolveFn<string> = () => this.titleService.buildTitle();
```

### Programmatically navigation

- declare the `router` variable
  
```ts
constructor(private router: Router){}
```

- Use the `navigate` method
  
```ts
onLoad() {
    this.router.navigate(['/servers'])
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
  // if the route reloads with different params, this.route.params doesn't run again
  // for getting the up-to-date params, subscribe to this.route.params
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

- place `<router-outlet></router-outlet>` in the parent
  - The components will be rendered next ti it

### Preserving params when navigating programmatically

- two options
  - `merge`
  - `preserve`
  
```ts
  this.route.navigate(['/users'], {queryParamsHandling: 'preserving'})
```

### Route guarding

- Write a ***Service*** that implements `CanActivate`
- Then, the function `canActivate` will later guard the route

```ts
import {Injectable} from "@angular/core";

type CanActivateReturnUnit = boolean | UrlTree

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
.
.
.  
canActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit

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
  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<CanActivateReturnUnit> | Promise<CanActivateReturnUnit> | CanActivateReturnUnit {
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

export class ServerResolverService implements Resolver<temp> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<temp> | Promise<temp> | temp {
    
  }
}
```

- In the route definition, add the resolve property
  
```ts
{path: 'error', component: PageNotFoundComponent, title: 'Ops', data: {message: 'Page not found'}, resolve: [ServiceResolverService]}
```

- The dynamic data will be stored on the `resolver`
- Read the data from the route, similarly to what is done with static data

## Observables

### Constructs which you subscribe to be informed about changes in data

### Angular makes use of observables as an interface to handle a variety of common *asynchronous operations*. For example

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

### Transforming observable data with `pipe` operator

```ts
const transformedIntervalObserver =  customIntervalObserver.pipe(map(data => {
  return `Count: ${data}`
}));
```

### Remember about the `catchError` operator inside `pipe` operator

- It catches the error of the subscription
- Then you can manipulate the error or even return a custom error
- Remember to return the error with `throwError` from rxjs
  - It will be the value accessed by the function with handles the error on the subscriber `(second function)`


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

- Give an input two pieces of information
  - `ngModel` directive to tell angular about the inputs you want to control
  - `name`: their representation will be named as the `name` input attribute
  
```html
<input name="myInput" ngModel>
```

- On the form tag, add
  
```html
<form (ngSubmit)="onSubmit(form)" #form="ngForm">
```

- When the form is submitted, all the inputs will produce an object `where the keys are the name property and the values are the input values`
  
```ts
  onSubmit(form: NgForm) {
  console.log(form) // form.value has the values of the inputs
}
```

### Accessing the form reference inside ts code

Use the `@ViewChild` reference builder with the `ngForm` type

### Form inputs register control

Add `ngModel` on the input elements you want to access

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
<input type="email" id="email" class="form-control" name="userEmail" ngModel email required  #email='ngModel'>
<span class="help-block" *ngIf="email.invalid && email.touched">Please enter a valid email</span>
```

### Setting form control default values

Use `[ngModel]='string'`

```html
<select [ngModel]="'pet'" id="secret" class="form-control" name="secreteQuestion" required>
```

### Types of biding with `ngModel`

- No biding => just tells Angular it's a form control, giving access to its value in the submitted object
- One-way-biding => no biding and for setting a default value
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
  - Return the object that represent (form as NgForm).value
- Form property from the form reference `(form: NgForm).form` => `patchValue`
  - For a specific control
  - Return an object where the key is the input control and the value is the input value to patch

### Resetting controls

- Use the `reset` method of the form reference
  - Reset all form state, including attributes (dirty, touched, pristine, ...)
- Use the `setValue` and reset all the controls

## Reactive forms

- Import the `ReactiveFormsModule`
- Assign your form to a formGroup directive as well as the controls
  - `Always type your form group declarations for a better TypeScript support`
  
```ts
  signupForm: FormGroup<{
    gender: FormControl<string | null>,
    email: FormControl<string | null>,
    username: FormControl<string | null>
}>

ngOnInit() {
  this.signUpForm = new FormGroup({
    'username': new FormControl(null, Validators.required),
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

- On your formGroup, create a field with the constructor `new FormArray()`
  
```ts
  this.signupForm = new FormGroup({
  ...
  hobbies: new FormArray([]),
})
```

- For adding an element, use the push method after casting the control as form array
  
```ts
onAddHobby() {
  (this.signupForm.get('hobbies') as FormArray<FormControl<string | null>>).push(new FormControl(null, Validators.required))
}
```

- For removing all, use `clear` method
  
```ts
onAddHobby() {
  (this.signupForm.get('hobbies') as FormArray<FormControl<string | null>>).clear()
}
```

- For removing an element, use `removeAt` method
  
```ts
removeHobby() {
  (this.signupForm.get('hobbies') as FormArray<FormControl<string | null>>).removeAt(hobbyIndex)
}
```

- For getting information about those controls on the template, for a loop for example, use a getter
  
```ts
  getHobbiesControls() {
  return (this.signupForm.get('hobbies') as FormArray<FormControl<string | null>>).controls
}
```

- On the template, give the container of those controls the `formArrayName`,which is the name of this `formArray` dynamic control, to let angular know where those controls will be
  - Also, assign the index of those controls to the `formControlName`
  
```html
<div formArrayName="hobbies">
  <h3>Hobbies</h3>
  <button class="btn btn-primary" type="button" (click)="onAddHobby()">Add a hobby</button>
  <div class="form-group" *ngFor="let hobby of getHobbiesControls(); let controlIndex = index">
    <input type="text" class="form-control" [formControlName]="controlIndex">
  </div>
</div>
```

## Custom validator `(there is also async validators)`

- Create a functions that when the control value is invalid, return `{errorCode: true}`, and when it's valid, return null
  
```ts
  forbiddenNamesValidator(control: AbstractControl): ValidationErrors | null {

  // for the case when the control has the forbidden name
  // invalid control
  if(this.forbiddenUserNames.includes(control.value)) {
    return {'isForbiddenName': true}
  }

  // for the case when the control does not have the forbidden name
  // valid control
  return null
}
```

- Add this validator function in the validators array of the form control
  
```ts
username: new FormControl<string | null>(null, [Validators.required, this.forbiddenNamesValidator.bind(this)])
```

- Use the validator state to show custom messages
  
```html
<input
        type="text"
        id="username"
        formControlName="username"
        class="form-control">
<span *ngIf="signUpForm.get('userdata.username').invalid && signUpForm.get('userdata.username').touched"
      class="help-block">Enter a valid username</span>
<span *ngIf="signUpForm.get('userdata.username').erros.isForbiddenName"
      class="help-block">This name is forbidden</span>
```

### Observables `statusChanges` and `valueChanges`

Listens to changes on a form or any other form control

### `setValue` and `patchValue` also exist for reactive-forms

## Pipes

Used for transforming output on the template (html file)

### Create a pipe

- create a class that implements `PipeTransform` and is decorated by the `Pipe` decorator
  - The transform function takes in the value to be transformed and the pipe parameters
- Add your pipe into the declaration module where it should be available

```ts
@Pipe({name: 'shorten'})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit = 10): string {
    if (value.length > limit) {
      return value.slice(0, limit) + ' ...'
    }
    return value
  }
}
```

#### Pure decorator property

```ts
@Pipe({name: 'sort', pure: false})
```

- When true, the pipe is pure, meaning that the transform() method is invoked only when its input arguments change. Pipes are pure by default.

#### Standalone pipe property

```ts
@Pipe({name: 'sort', standalone: true})
```

- Angular pipes marked as standalone do not need to be declared in an NgModule

#### If possible, try to use more the `async` pipe

- Angular unwraps the content and automatically destroys the subscription for you

## HTTP module

- As simple as possible
- Just remember about setting query params, headers, and interceptors
- Remember about adding the interceptors in the providers
  
```ts
 providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
]
```

## Dynamic components
  
### Old way

```ts
private showAlertComponent(errorMessage: string | null): void {
    if (!errorMessage) return;

    const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponent =
        hostViewContainerRef.createComponent(componentFactory);

    alertComponent.instance.message = this.pipeError.transform(errorMessage);
    alertComponent.instance.close.pipe(take(1)).subscribe(() => {
    hostViewContainerRef.clear();
});
}
```

### New way

Check `NgComponentOutlet` at <https://angular.io/guide/dynamic-component-loader>

## Modules

- CommonModule is the equivalent of BrowserModule
  - Use it for other modules, except the main module, where BrowserModule should be used
- Export `(add to the export array from a module)` only what you plan to use externally in other module
- For routing modules, use `forChild` in the newly created routing module

```ts
imports: [RouterModule.forChild(routes)]
```

- You can declare something in the `declarations` only once
- Module types
  - feature modules
  - shared modules
    - Avoid providing services in shared modules, it can cause bugs hard to debug, because it creates a new instance of the imported service
  - core module

### Lazy loading

- Remove module from imports of main module, like app module
  - The imports in the `imports` are eagerly imported, not lazily
- In the main module routes, declare the module to be lazily imported, like so
  
```ts
{
    path: 'recipes',
    loadChildren: () =>
      import('./recipe/recipe.module').then((module) => module.RecipeModule),
}
```

- Start the routes in the lazily imported module as an empty route
  - Because you already declared it in the main module route
  
## Unidirectional data flow

A data flow model where the component tree is always checked for changes in one direction from parent to child, which prevents cycles in the change detection graph.

In practice, this means that data in Angular flows downward during change detection. A parent component can easily change values in its child components because the parent is checked first. A failure could occur, however, if a child component tries to change a value in its parent during change detection (inverting the expected data flow), because the parent component has already been rendered. In development mode, Angular throws the `ExpressionChangedAfterItHasBeenCheckedError` error if your application attempts to do this, rather than silently failing to render the new value.

To avoid this error, a lifecycle hook method that seeks to make such a change should trigger a new change detection run. The new run follows the same direction as before, but succeeds in picking up the new value

## Dependency injection

### `useClass`

The useClass provider key lets you create and return a new instance of the specified class 

You can use this type of provider to substitute an alternative implementation for a common or default class

In the following example, the BetterLogger class would be instantiated when the Logger dependency is requested in a component or any other class

```ts
[{ provide: Logger, useClass: BetterLogger }]
``` 

If the alternative class providers have their own dependencies, specify both providers in the providers metadata property of the parent module or component

```ts
[ UserService,  { provide: Logger, useClass: EvenBetterLogger }]
```

```ts
@Injectable()
export class EvenBetterLogger extends Logger {
    
  constructor(private userService: UserService) { super(); }

  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
```

### `useExisting`

The useExisting provider key lets you map one token to another

In effect, the first token is an alias for the service associated with the second token, creating two ways to access the same service object

In the following example, the injector injects the singleton instance of NewLogger when the component asks for either the new or the old logger. 

In this way, OldLogger is an alias for NewLogger

```ts
[ NewLogger,
  // Alias OldLogger w/ reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger}]
```

### `useFactory`

Build factories

### `useValue`

Provide configs, feature flags, etc.

### Using an `InjectionToken` object

```ts
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
```

```ts
providers: [{ provide: APP_CONFIG, useValue: HERO_DI_CONFIG }]
```

```ts
constructor(@Inject(APP_CONFIG) 
            config: AppConfig) {
  this.title = config.title;
}
```
