import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
export class GembaServiceProvider {
  imagen_mini:string;
  constructor(public http: HttpClient) {
   
  }

  getEventos(whoID:number,where:number) {
   // return this.http.get(`http://cpx.aldana.info:81/evento/${where}`);
   return this.http.get(`http://ec2-3-17-4-67.us-east-2.compute.amazonaws.com:81/evento`);
  }

  getSubArea(eventoID:number) {
    return this.http.get(`http://ec2-3-17-4-67.us-east-2.compute.amazonaws.com:81/area/${eventoID}`);
  }

  insert_imagen(hallazoID:number,imagen_normal:string,imagen_mini) {
    const endPoint='http://cpx.aldana.info:81/evidencia';
  
    return this.http.post(endPoint,{
      "gemba_walkID": hallazoID,  //hallazgoID
      "archivo": imagen_normal,  
      "tipo": 0,
      "archivo_mini":imagen_mini      
      } 
   );

  }

  
  insert_hallazgo(eventoID:number,fecha:string,areaID:number,subareaID:number,tipo_hallazgoID:number,tipo_implementacionID:number,
  descripcion:string,observadorID:number) {
    
  //const endPoint='http://10.11.1.14:91/api/gemba_walk';
  const endPoint='http://cpx.aldana.info:81/hallazgo';
  console.log(descripcion);
  return this.http.post(endPoint,{
                    "areaID": areaID,
                    "gemba_walk_eventoID":eventoID,
                    "fecha": fecha,
                    "fecha_inicio": fecha,
                    "fecha_compromiso": "2017-12-20T00:00:00",
                    "fecha_implementacion": null,
                    "delta": null,
                    "responsableID": 0,
                    "gemba_walk_tipo_hallazgoID": tipo_hallazgoID,
                    "gemba_walk_avanceID": 1,
                    "gemba_walk_tipo_implementacionID": tipo_implementacionID,
                    "hallazgos": descripcion,
                    "comentarios": "",
                    "estatus": 0,
                    "subareaID": subareaID,
                    "observadorID": observadorID,
                    "oldID": null,
                    "mark": false,
                    "quien": null,
                    "cuando": null,
                    "fecha_cierre": null
            }
          
        )
  
      }

    log_in(usuario:string,password:string) {
       let endPoint=  `http://cpx.aldana.info:81/login/${usuario}/`+encodeURIComponent(password);
       return this.http.get(endPoint,{});
      }
}