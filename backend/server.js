import {app} from './app.js';
app.listen(Number(process.env.PORT||3012),'0.0.0.0',()=>console.log('API MoodAlert pronta.'));
