# AngularEcommerce

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Security Angular app

# OpenSSL Setup - Generate key and self-signed certificate

This document includes instructions for OpenSSL setup. It also includes steps for generating key and self-signed certificate. 

## MS Windows-Install OpenSSL
1. In your web browser, visit the link: https://slproweb.com/products/Win32OpenSSL.html

2. In the table, move to the entry: **Win64 OpenSSL v1.1.x Light**. 

3. Select the **MSI** download link

3. Once downloadeded to your computer, run the MSI file

4. During the installation process, select all of the defaults.

5. Update your system path environment variable to point to the openssl installation

    a. Open the MS Windows Control Panel

    b. Select **System > Advanced System Settings**

    c. Click **Environment Variables**

    d. In the **System variables** section, select the **Path** variable and click the **Edit** button.

    e. At the beginning of the path, add: `c:\Program Files\OpenSSL-Win64\bin;`

    > **_NOTE:_** Be sure to update with the installation directory on your computer accordingly.

    f. Click **Ok** and proceed to close all of the dialogs.

### Verify OpenSSL installation

Let's verify the OpenSSL installation

1. Open a new command-prompt window.

2. Type the following command:
openssl help

3. You will see the version of openssl installed. If so then openssl is installed successfully. :-)


### Generate Key and Self-Signed Certificate

1. Open a command-prompt window.

2. Move into the directory of your Angular ecommerce project.
cd angular-ecommerce


3. Create a new directory for your output files
mkdir ssl-localhost


4. Create a configuration file for the OpenSSL utility. 

    a. In the directory: `angular-ecommerce`
    
    b. Create a new file named: `localhost.conf`

4. Open the `localhost.conf` file and enter the following:
[req]
# Don't prompt the user when running openssl certificate generation
prompt = no

# Reference to the section containing the Distinguished Name (information about your company/entity)
distinguished_name = dn

[dn]
# Country, State and Locality (city)
C = US
ST = Pennsylvania
L = Philadelphia

# Organization and Organizational Unit (department name, group name)
O = ecommerce
OU = Training

# Common Name (fully qualified domain name of your website server)
CN = localhost


5. Save the file.

6. In the terminal window, run this command to generate the key and certificate. _Be sure to enter this command as a single line._
openssl req -x509 -out ssl-localhost\localhost.crt -keyout ssl-localhost\localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -config localhost.conf


6. This command generates the following output:
    ```
    Generating a 2048 bit RSA private key
    .......+++
    ...............................+++
    writing new private key to 'ssl-localhost/localhost.key'
    ```

7. The command generates two files: `localhost.crt` and `localhost.key`.
You have successfully generated a key and self-signed certificate.


