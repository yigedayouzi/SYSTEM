<template>
    <div class="not_found">
        <a class="the_font">404</a>
    </div>
</template>

<script>
    export default{
     name:"NotFound",   
    };
</script>

<style scoped>
.not_found{
width: 400px;
height: 400px;
position: absolute;
top: 0;
right: 0;
left: 0;
bottom: 0;
margin: auto;
transform:translateX(-50%);
}
.the_font{
font-size: 400px;
line-height: 400px;
}
</style>