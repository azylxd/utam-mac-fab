// ENTRY COMPONENT
import { MyApp } from './app.component';
// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipesModule } from '../pipes/pipes.module';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//import hypher from 'hypher';
//import hyphenation from 'hyphenation.es';

// IONIC NATIVE PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { OneSignal } from '@ionic-native/onesignal';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Diagnostic } from '@ionic-native/diagnostic';
// COMPONENTS
import { AlertProvider } from '../providers/componentes/alert';
import { ConectividadProvider } from '../providers/componentes/conectividad_listener';
import { ToastProvider } from '../providers/componentes/toast';
import { OneSignalProvider } from '../providers/componentes/onesignal';
import { DeviceProvider } from '../providers/componentes/device';
//API
import { UtaProvider } from '../providers/API/uta';
//UTILS
import { RutProvider } from '../providers/utils/rut';
import { Base64Provider } from '../providers/utils/base64';
import { FormateadorProvider } from '../providers/utils/formateador';
//STORAGE
import { AsignaturasProvider } from '../providers/storage/asignaturas';
import { AsistenciasProvider } from '../providers/storage/asistencias';
import { CarreraProvider } from '../providers/storage/carrera';
import { EvaluacionesProvider } from '../providers/storage/evaluaciones';
import { InscripcionesProvider } from '../providers/storage/inscripciones';
import { MensajesProvider } from '../providers/storage/mensajes';
import { NoticiasProvider } from '../providers/storage/noticias';
import { NotificationsProvider } from '../providers/storage/notification';
import { PeriodosProvider } from '../providers/storage/periodos';
import { RecursosProvider } from '../providers/storage/recursos';
import { PersonalProvider } from '../providers/storage/personal';
import { StorageProvider } from '../providers/storage/storage';
import { AuthProvider } from '../providers/storage/auth';
import { Utf8DecodePipe } from '../pipes/utf8-decode';
import { ErrorInterceptor } from '../providers/utils/interceptor';
import { ScheduleProvider } from '../providers/storage/schedule';
import { NavigationProvider } from '../providers/navigation/navigation';
import { LoadingProvider } from '../providers/loading/loading';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    PipesModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      backButtonText: ''
    }),
    IonicStorageModule.forRoot({
      name: 'utaDB',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Network,
    Toast,
    OneSignal,
    FileOpener,
    Device,
    File,
    FileTransfer,
    FileTransferObject,
    SocialSharing,
    Diagnostic,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //API
    UtaProvider,
    //COMPONENTES
    ConectividadProvider,
    ToastProvider,
    OneSignalProvider,
    AlertProvider,
    //UTILS
    Base64Provider,
    RutProvider,
    FormateadorProvider,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
      }
    ],
    //STORAGE
    AsignaturasProvider,
    AsistenciasProvider,
    AuthProvider,
    CarreraProvider,
    EvaluacionesProvider,
    InscripcionesProvider,
    NoticiasProvider,
    PeriodosProvider,
    RecursosProvider,
    MensajesProvider,
    NotificationsProvider,
    PersonalProvider,
    StorageProvider,
    Utf8DecodePipe,
    DeviceProvider,
    ScheduleProvider,
    NavigationProvider,
    LoadingProvider
  ]
})
export class AppModule { }
