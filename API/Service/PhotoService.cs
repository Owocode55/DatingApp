using System;
using API.Interface;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Service;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _clodinary;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(config.Value.CloudName , config.Value.ApiKey , config.Value.ApiSecrete);

        _clodinary = new Cloudinary(account);
    }
    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deletionParam = new DeletionParams(publicId); 

        return await _clodinary.DestroyAsync(deletionParam);
    }

    public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if(file.Length > 0)
        {
            await using var stream = file.OpenReadStream();

            var param = new ImageUploadParams
            {
                File = new FileDescription(file.Name , stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "Testing-one"
            };

            uploadResult = await _clodinary.UploadAsync(param);
        }
        return uploadResult;
    }
}
