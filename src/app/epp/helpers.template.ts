import * as Handlebars from 'handlebars';

/** Common handlebars template helpers */

/** This function is here to make sure that the module is loaded */
export function init() {
}

// reproduce 'isNonnull' helper function from soy templates
// use function instead of lambda due to handlebars context binding
// see isNonnull at https://developers.google.com/closure/templates/docs/functions
Handlebars.registerHelper('ifNonnull', function(value: any, options: any) {
  // if value is undefined, value == null evaluates to true
  if (value == null) {
    return '';
  } else {
    return options.fn(this);
  }
});

// Returns the ip version based on the address
Handlebars.registerHelper('ipVersion', function(value: string) {
  if (!value) {
    return 'NULL_IP_ADDRESS';
  }
  if (value.indexOf(':') > -1) {
    return 'v6';
  }
  return 'v4';
});
