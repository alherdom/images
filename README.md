<div align="center">

# Ngx Small Light. Images.

</div>

<div align="right">

#### ***Alejandro Hernández Domínguez***

#### ***2º de Ciclo Superior de Desarrollo de Aplicaciones Web***

</div>

### ÍNDICE

<div align="justify">


+ [Introducción.](#id1)
+ [Objetivos.](#id2)
+ [Material empleado.](#id3)
+ [Aplicación web.](#id4)
+ [Desarrollo.](#id5)
+ [Conclusiones.](#id6)


### Introducción <a name="id1"></a>

1. Implantar una aplicación, "Images" que permita generar miniaturas de imagenes on the fly además de otros posibles procesamientos a través de peticiones URL, usando Nginx + Ngx Small Light.

### Objetivos <a name="id2"></a>

 1. Instalar el módulo ngx_small_light y cargarlo dinámicamente en Nginx.
 2.Crear un virtual host específico que atienda peticiones en el dominio images.nombrealumno.me (server_name).
 2. Habilitar el módulo ngx_small_light en el virtual host sólo para el location /img.
 3. Subir las imágenes de images.zip (el archivo de adjunta a la tarea ) a una carpeta img dentro de la carpeta de trabajo elegida.
 4. Crear una aplicación web que permita el tratamiento de dichas imágenes.
 5. Incorporar certificado de seguridad (mostrar el certificado 🔒).
 6. Redirigir el subdominio www al dominio base (incluyendo ssl).

<img src="template.png">

2. Incluir esta imagen de la calculadora que se adjunta.
3. Incluir un fichero .css con unos estilos básicos.
4. La "calculadora nativa" debe tener como título h1 "Calculadora en entorno nativo" y la "calculadora dockerizada" debe tener como título h1 "Calculadora en entorno dockerizado".
5. Trabajar en una carpeta dentro del $HOME.

### Material empleado <a name="id3"></a>

1. Se ha empleado el equipo del aula
2. Las máquinas virtuales configuradas para el despliegue. 
3. Despliegue nativo haciendo uso de servidor nginx.
4. Despliegue dokerizado, mediante docker compose.
5. Para la instalación del módulo seguir las instrucciones de instalación de módulos, teniendo en cuenta que:

- Hay que instalar las siguientes dependencias:

```
sudo apt install -y build-essential imagemagick libpcre3 libpcre3-dev libmagickwand-dev
```

- Hay que descargar el código fuente del módulo con:

```
git clone https://github.com/cubicdaiya/ngx_small_light.git
```

- Hay que "configurar" el módulo, previo a la configuración de Nginx, entrando en la carpeta del módulo y ejecutando:

```
./setup
```

### Aplicacion Web<a name="id4"></a>

La aplicación debe contener un formulario web con los siguientes campos de texto:

- Tamaño de la imagen → En píxeles (corresponde al "lado": imágenes cuadradas)
- Ancho del borde → En píxeles
- Color del borde → Formato hexadecimal
- Enfoque → Formato <radius>x<sigma>
- Desenfoque → Formato <radius>x<sigma>

Al pulsar el botón de **Generar** se tendrán que mostrar todas las imágenes cambiando la URL del atributo src de cada imagen <img> para contemplar los parámetros establecidos en el formulario.

<div align="center">

<img src="img_md/image14.png">

</div>

### Desarrollo<a name="id5"></a>

- Para comenzar la práctica nos conectamos a la máquina servidor a través de ssh y una máquina cliente, habrá que accder con la contraseña:

```
ssh 10.109.18.40
```

- Instalaremos el modulo **Small Light** siguiendo los siguientes comandos:

```
sudo apt install -y build-essential imagemagick libpcre3 libpcre3-dev libmagickwand-dev
```

```
git clone https://github.com/cubicdaiya/ngx_small_light.git
```

```
./setup
```

- Moveremos el directrio del modulo al directorio **/tmp**:

```
mv ngx_small_light/ /tmp/
```

- Dado que el código fuente de **nginx-1.24** no se encuentra en **/tmp** los descargaremos nuevamente:

```
curl -sL https://nginx.org/download/nginx-$(/sbin/nginx -v \ |& cut -d '/' -f2).tar.gz | tar xvz -C /tmp
```

- Ejecutamos la configuración de la compilación con el siguiente comando, estando en el directorio **/tmp/nginx-1.24.0**:

```
cd /tmp/nginx-1.24.0
```

```
./configure --add-dynamic-module=../ngx_small_light --with-compat
```

- Estando en el mismo directorio y subcarpeta ejecutaremos el siguiente comandopara generar la librería dinámica:

```
make modules
```

- A continuación se habrá generado un fichero **.so** dentro del directorio **objs** desde la cual se cargan los módulos dinámicos de **nginx**:

```
sudo cp /tmp/nginx-1.24.0/objs/ngx_http_small_light_module.so .
```

- Para que el módulo se cargue correctamente, hay que especificarlo en el fichero de configuración de **nginx**:

```
pc18-dpl@a109pc18dpl:~$ cat /etc/nginx/nginx.conf 

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

load_module /etc/nginx/modules/ngx_http_fancyindex_module.so;
load_module /etc/nginx/modules/ngx_http_small_light_module.so;

events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

- Finalmente, con respecto a la configuración, añadiremos las directivas del módulo a la configuración del **virtual host** modificando el fichero **images.conf**:

```
sudo nano /etc/nginx/conf.d/images.conf
```

```
pc18-dpl@a109pc18dpl:~$ cat /etc/nginx/conf.d/images.conf 
server {
	
	root /usr/share/nginx/images;
	server_name images.alejandrohernandez.me;
	index index.html;	
	
	location /img {
		small_light on;
		small_light_getparam_mode on;
	}
}
```

- Deberemos recargar el servicio de **nginx**, se recomienda hacer uso también de el siguiente comando para control de errores:

```
sudo systemctl reload nginx
```

```
sudo tail -f /var/log/nginx/error.log
```

- Será necesario crear una estructura de carpetas en la ruta correspondiente, en la que se encuentren: código HTML, estilos CSS, y funcionalidades en JavaScript. Todos ellos en sus directorios respectivamente, como se muestra a continuación:

```
pc18-dpl@a109pc18dpl:/usr/share/nginx/images$ tree
.
├── css
│   └── style.css
├── img
│   ├── image01.jpg
│   ├── image02.jpg
│   ├── image03.jpg
│   ├── image04.jpg
│   ├── image05.jpg
│   ├── image06.jpg
│   ├── image07.jpg
│   ├── image08.jpg
│   ├── image09.jpg
│   ├── image10.jpg
│   ├── image11.jpg
│   ├── image12.jpg
│   ├── image13.jpg
│   ├── image14.jpg
│   ├── image15.jpg
│   ├── image16.jpg
│   ├── image17.jpg
│   ├── image18.jpg
│   ├── image19.jpg
│   └── image20.jpg
├── index.html
└── js
    └── script.js

4 directories, 23 files
```

- Para mayor fluidez en el desarrollo de la práctica se recomienda hacer uso de las extesiones, en este caso para **VS Code** de **Remote - SSH** para conectarnos a través de ssh, usando **VSCode** a la máquina servidor, y a su vez, hacer uso de la extensión **Save as Root in Remote - SSH** para evitar el bloqueo por permisos de copia y creación de directorios y ficheros en la máquina. La **Five - Server** también se considera una extensión de gran utilidad.

<div align="center">

<img src="img_md/image10.png">

</div>

<div align="center">

<img src="img_md/image15.png">

</div>

### Conclusiones<a name="id6"></a>

En términos generales la práctica ha servido para conocer distintos módulos para hacer uso en aplicaciones web y ...