# Data Visualization Tool

 A web application that can be used to visualize data provided by client / user as several different plots.

## Installation

1. Follow the steps [here](
https://devcenter.heroku.com/articles/getting-started-with-python#set-up
) to set up Heroku CLI.
   
   To update Heroku CLI, run the following command.

         heroku update

2. Ensure that Node.js has been installed by running the following command. If not installed, download the installer [here](https://nodejs.org/en/download/) and install.

         node --version
         npm --version

3. Install dependencies.

         npm install --production
      
3. Run app locally
   
         npm start
      
4. Deploy web app to Heroku

         heroku create <app_name> --buildpack https://github.com/mars/create-react-app-buildpack.git
         git push heroku <branch_name>

5. Visit app's public URL in browser

         heroku open


## References

1. [Getting Started on Heroku with Node.js](
   https://devcenter.heroku.com/articles/getting-started-with-nodejs
   )

2. [Heroku Buildpack for create-react-app](https://elements.heroku.com/buildpacks/nhutphuongit/create-react-app-buildpack)
