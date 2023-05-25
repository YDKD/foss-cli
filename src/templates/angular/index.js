import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Hello, {{ name }}!</h1>
    </div>
  `,
})
export class AppComponent {
  name = '<%= name %>';
}
