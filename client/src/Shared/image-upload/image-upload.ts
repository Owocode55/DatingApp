import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imgSrc = signal<string | ArrayBuffer | undefined | null>(null);
 isDragging : boolean = false;
 private fileToUpload : File | null = null;
 uploadFile = output<File>();
 isLoading = input<boolean>();


onDragOver(event : DragEvent){
  event.stopPropagation();
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event : DragEvent){
  event.stopPropagation();
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event : DragEvent){
  event.stopPropagation();
  event.preventDefault();
  this.isDragging = false;

  if(event.dataTransfer?.files.length){
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file

  }
  
}

private previewImage(file : File){
  const reader = new FileReader();
  reader.onload = (e)=> {
    this.imgSrc.set(e.target?.result);
  }
  reader.readAsDataURL(file);
}

onCancel(){
  this.fileToUpload = null;
  this.imgSrc.set(null)
}

onUpload(){
  if(this.fileToUpload){
    console.log("Is loding in image-upload", this.isLoading())
    this.uploadFile.emit(this.fileToUpload);
  }
}

}
